import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';

import StuffScreen from './src/screens/StuffScreen';
import QueOrderScreen from './src/screens/QueOrderScreen';
import AllBillsScreen from './src/screens/AllBillsScreen';
import TableScreen from './src/screens/TableScreen';
import MenuScreen from './src/screens/MenuScreen';
import CheckOrderScreen from './src/screens/CheckOrderScreen';
import StatusOrderScreen from './src/screens/StatusOrderScreen';
import BillScreen from './src/screens/BillScreen';
import { Tables } from './src/database/tablesdata';
import { CATEGORIES, MENU_ITEMS } from './src/database/menuData';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

async function initializeDatabase(db) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS categories (category_id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, is_active INTEGER NOT NULL CHECK(is_active IN (0, 1)));
    CREATE TABLE IF NOT EXISTS menu_items (menu_item_id INTEGER PRIMARY KEY NOT NULL, category_id INTEGER NOT NULL, name TEXT NOT NULL, price INTEGER NOT NULL CHECK(price >= 0), is_available INTEGER NOT NULL CHECK(is_available IN (0, 1)), FOREIGN KEY(category_id) REFERENCES categories(category_id) ON DELETE RESTRICT);
    CREATE TABLE IF NOT EXISTS restaurant_tables (table_id INTEGER PRIMARY KEY NOT NULL, table_number INTEGER NOT NULL UNIQUE, is_active INTEGER NOT NULL CHECK(is_active IN (0, 1)));
    CREATE TABLE IF NOT EXISTS bills (bill_id INTEGER PRIMARY KEY NOT NULL, table_id INTEGER NOT NULL, opened_at TEXT NOT NULL, closed_at TEXT, status TEXT NOT NULL CHECK(status IN ('open', 'closed')), FOREIGN KEY(table_id) REFERENCES restaurant_tables(table_id) ON DELETE RESTRICT);
    CREATE TABLE IF NOT EXISTS order_rounds (round_id INTEGER PRIMARY KEY NOT NULL, bill_id INTEGER NOT NULL, round_number INTEGER NOT NULL CHECK(round_number > 0), ordered_at TEXT NOT NULL, UNIQUE(bill_id, round_number), FOREIGN KEY(bill_id) REFERENCES bills(bill_id) ON DELETE RESTRICT);
    CREATE TABLE IF NOT EXISTS order_items (order_item_id INTEGER PRIMARY KEY NOT NULL, round_id INTEGER NOT NULL, menu_item_id INTEGER NOT NULL, quantity INTEGER NOT NULL CHECK(quantity > 0), unit_price INTEGER NOT NULL CHECK(unit_price >= 0), note TEXT, status TEXT NOT NULL CHECK(status IN ('waiting', 'cooking', 'served', 'cancelled')), cancelled_at TEXT, FOREIGN KEY(round_id) REFERENCES order_rounds(round_id) ON DELETE RESTRICT, FOREIGN KEY(menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE RESTRICT);
    CREATE INDEX IF NOT EXISTS idx_order_items_round_id ON order_items(round_id);
    CREATE INDEX IF NOT EXISTS idx_order_rounds_bill_id ON order_rounds(bill_id);
  `);
  for (const category of CATEGORIES) {
    await db.runAsync('INSERT OR IGNORE INTO categories (category_id, name, is_active) VALUES (?, ?, ?)', category.category_id, category.name, Number(category.is_active));
  }
  for (const item of MENU_ITEMS) {
    await db.runAsync('INSERT OR IGNORE INTO menu_items (menu_item_id, category_id, name, price, is_available) VALUES (?, ?, ?, ?, ?)', item.menu_item_id, item.category_id, item.name, item.price, Number(item.is_available));
  }
  for (const table of Tables) {
    await db.runAsync('INSERT OR IGNORE INTO restaurant_tables (table_id, table_number, is_active) VALUES (?, ?, 1)', Number(table.id), Number(table.id));
  }
}

export default function App() {
  const [db, setDb] = useState(null);
  const [startupError, setStartupError] = useState('');
  const [activeTable, setActiveTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const database = await SQLite.openDatabaseAsync('restaurant.db');
        await initializeDatabase(database);
        if (live) setDb(database);
      } catch (error) {
        if (live) setStartupError(error?.message || 'เปิดฐานข้อมูลไม่สำเร็จ');
      }
    })();
    return () => { live = false; };
  }, []);

  const refresh = () => setRefreshKey((value) => value + 1);
  const getTable = (tableId) => Tables.find((table) => Number(table.id) === Number(tableId));

  const submitOrder = async (items, navigation) => {
    if (!db || !activeTable || !items?.length) return;
    try {
      await db.withTransactionAsync(async () => {
        let bill = await db.getFirstAsync("SELECT bill_id FROM bills WHERE table_id = ? AND status = 'open' ORDER BY bill_id DESC LIMIT 1", Number(activeTable.id));
        if (!bill) {
          const result = await db.runAsync("INSERT INTO bills (table_id, opened_at, status) VALUES (?, ?, 'open')", Number(activeTable.id), new Date().toISOString());
          bill = { bill_id: result.lastInsertRowId };
        }
        const lastRound = await db.getFirstAsync('SELECT COALESCE(MAX(round_number), 0) AS number FROM order_rounds WHERE bill_id = ?', bill.bill_id);
        const roundResult = await db.runAsync('INSERT INTO order_rounds (bill_id, round_number, ordered_at) VALUES (?, ?, ?)', bill.bill_id, lastRound.number + 1, new Date().toISOString());
        for (const item of items) {
          await db.runAsync("INSERT INTO order_items (round_id, menu_item_id, quantity, unit_price, note, status) VALUES (?, ?, ?, ?, ?, 'waiting')", roundResult.lastInsertRowId, Number(item.menu_item_id), Number(item.quantity), Number(item.unit_price), item.note || null);
        }
      });
      setCart([]);
      refresh();
      navigation.navigate('StatusOrder');
    } catch (error) {
      Alert.alert('บันทึกออเดอร์ไม่สำเร็จ', error?.message || 'กรุณาลองใหม่');
    }
  };

  const screenProps = {
    db, refreshKey, refresh,
    table: activeTable,
    onGoTables: () => navigationRef.navigate('Tables'),
    onGoMenu: () => navigationRef.navigate('Menu'),
    onGoOrder: () => navigationRef.navigate('StatusOrder'),
    onGoBill: () => navigationRef.navigate('Bill'),
  };

  if (startupError) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}><Text>ฐานข้อมูลเริ่มต้นไม่สำเร็จ: {startupError}</Text></View>;
  if (!db) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /><Text style={{ marginTop: 10 }}>กำลังเตรียมฐานข้อมูล…</Text></View>;

  return <>
    <StatusBar style="auto" />
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="StuffScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StuffScreen">{(props) => <StuffScreen {...props} onStartOrder={() => props.navigation.navigate('Tables')} />}</Stack.Screen>
        <Stack.Screen name="Tables">{(props) => <TableScreen {...props} db={db} refreshKey={refreshKey} onSelectTable={(table) => { setActiveTable(table); setCart([]); props.navigation.navigate('Menu'); }} />}</Stack.Screen>
        <Stack.Screen name="Menu">{(props) => <MenuScreen {...props} {...screenProps} cart={cart} onCartChange={setCart} />}</Stack.Screen>
        <Stack.Screen name="CheckOrder">{(props) => <CheckOrderScreen {...props} {...screenProps} cart={cart} onCancel={() => props.navigation.goBack()} onConfirm={(items) => submitOrder(items, props.navigation)} />}</Stack.Screen>
        <Stack.Screen name="StatusOrder">{(props) => <StatusOrderScreen {...props} {...screenProps} onCancelItem={async (id) => { await db.runAsync("UPDATE order_items SET status='cancelled', cancelled_at=? WHERE order_item_id=? AND status='waiting'", new Date().toISOString(), Number(id)); refresh(); }} />}</Stack.Screen>
        <Stack.Screen name="Bill">{(props) => <BillScreen {...props} {...screenProps} />}</Stack.Screen>
        <Stack.Screen name="QueOrderScreen">{(props) => <QueOrderScreen {...props} {...screenProps} onSetStatus={async (id, status) => { await db.runAsync('UPDATE order_items SET status=? WHERE order_item_id=? AND status IN (\'waiting\', \'cooking\')', status, Number(id)); refresh(); }} />}</Stack.Screen>
        <Stack.Screen name="AllBillsScreen">{(props) => <AllBillsScreen {...props} {...screenProps} onCloseBill={async (billId) => {
          const pending = await db.getFirstAsync("SELECT COUNT(*) AS count FROM order_items i JOIN order_rounds r ON r.round_id=i.round_id WHERE r.bill_id=? AND i.status IN ('waiting', 'cooking')", Number(billId));
          if (pending.count > 0) {
            Alert.alert('ยังปิดบิลไม่ได้', `ยังมี ${pending.count} รายการที่รอทำหรือกำลังทำอยู่`);
            return;
          }
          await db.runAsync("UPDATE bills SET status='closed', closed_at=? WHERE bill_id=? AND status='open'", new Date().toISOString(), Number(billId));
          refresh();
        }} onOpenBill={(bill) => { setActiveTable(getTable(bill.table_id)); props.navigation.navigate('Bill', { billId: bill.bill_id }); }} />}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  </>;
}
