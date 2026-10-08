import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import StuffScreen from './src/screens/StuffScreen';
import QueOrderScreen from './src/screens/QueOrderScreen';
import AllBillsScreen from './src/screens/AllBillsScreen';
import TableScreen from './src/screens/TableScreen';
import MenuScreen from './src/screens/MenuScreen';
import CheckOrderScreen from './src/screens/CheckOrderScreen';
import StatusOrderScreen from './src/screens/StatusOrderScreen';
import BillScreen from './src/screens/BillScreen';
import { Tables } from './src/database/tablesdata';
import { openRestaurantDatabase, saveOrder, cancelOrderItem, changeOrderStatus, closeBill } from './src/database/restaurantDatabase';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function App() {
  const [db, setDb] = useState(null);
  const [startupError, setStartupError] = useState('');
  const [activeTable, setActiveTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function startDatabase() {
      try {
        const database = await openRestaurantDatabase();
        if (isMounted) setDb(database);
      } catch (error) {
        if (isMounted) setStartupError(error?.message || 'Could not open the database.');
      }
    }

    startDatabase();
    return () => { isMounted = false; };
  }, []);

  function refreshScreens() {
    setRefreshKey((oldValue) => oldValue + 1);
  }

  function getTable(tableId) {
    return Tables.find((table) => Number(table.id) === Number(tableId));
  }

  async function confirmOrder(items, navigation) {
    if (!activeTable || items.length === 0) return;

    try {
      await saveOrder(db, activeTable.id, items);
      setCart([]);
      refreshScreens();
      navigation.navigate('StatusOrder');
    } catch (error) {
      Alert.alert('Could not save the order', error?.message || 'Please try again.');
    }
  }

  async function cancelItem(itemId) {
    await cancelOrderItem(db, itemId);
    refreshScreens();
  }

  async function updateKitchenStatus(itemId, status) {
    await changeOrderStatus(db, itemId, status);
    refreshScreens();
  }

  async function finishBill(billId) {
    const wasClosed = await closeBill(db, billId);
    if (!wasClosed) {
      Alert.alert('ยังปิดบิลไม่ได้', 'ยังมีรายการที่รอทำหรือกำลังทำอยู่');
      return;
    }
    refreshScreens();
  }

  const screenProps = {
    db,
    refreshKey,
    table: activeTable,
    onGoTables: () => navigationRef.navigate('Tables'),
    onGoMenu: () => navigationRef.navigate('Menu'),
    onGoOrder: () => navigationRef.navigate('StatusOrder'),
    onGoBill: () => navigationRef.navigate('Bill'),
  };

  if (startupError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text>Database error: {startupError}</Text>
      </View>
    );
  }

  if (!db) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Preparing database…</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="StuffScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="StuffScreen">
            {(props) => (
              <StuffScreen
                {...props}
                onStartOrder={() => props.navigation.navigate('Tables')}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Tables">
            {(props) => (
              <TableScreen
                {...props}
                db={db}
                refreshKey={refreshKey}
                onSelectTable={(table) => {
                  setActiveTable(table);
                  setCart([]);
                  props.navigation.navigate('Menu');
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Menu">
            {(props) => (
              <MenuScreen
                {...props}
                {...screenProps}
                cart={cart}
                onCartChange={setCart}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="CheckOrder">
            {(props) => (
              <CheckOrderScreen
                {...props}
                {...screenProps}
                cart={cart}
                onCancel={() => props.navigation.goBack()}
                onCartChange={setCart}
                onConfirm={(items) => confirmOrder(items, props.navigation)}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="StatusOrder">
            {(props) => (
              <StatusOrderScreen
                {...props}
                {...screenProps}
                onCancelItem={cancelItem}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Bill">
            {(props) => <BillScreen {...props} {...screenProps} />}
          </Stack.Screen>

          <Stack.Screen name="QueOrderScreen">
            {(props) => (
              <QueOrderScreen
                {...props}
                {...screenProps}
                onSetStatus={updateKitchenStatus}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AllBillsScreen">
            {(props) => (
              <AllBillsScreen
                {...props}
                {...screenProps}
                onCloseBill={finishBill}
                onOpenBill={(bill) => {
                  setActiveTable(getTable(bill.table_id));
                  props.navigation.navigate('Bill', { billId: bill.bill_id });
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
