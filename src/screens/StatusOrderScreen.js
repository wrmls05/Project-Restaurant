import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/menuStyle';

const STATUS_LABEL = { waiting: 'กำลังรอทำ', cooking: 'กำลังทำ', served: 'เสิร์ฟแล้ว', cancelled: 'ยกเลิกแล้ว' };

export default function StatusOrderScreen({ db, table, onCancelItem, onGoTables, onGoMenu, onGoBill, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      try {
        const rows = await db.getAllAsync(`
          SELECT 
            i.order_item_id AS id, 
            i.quantity, 
            i.unit_price, 
            i.note, 
            i.status, 
            r.round_number,
            m.name
          FROM order_items i 
          JOIN order_rounds r ON r.round_id=i.round_id 
          JOIN bills b ON b.bill_id=r.bill_id
          JOIN menu_items m ON m.menu_item_id=i.menu_item_id 
          WHERE b.table_id=? 
            AND b.status='open'
          ORDER BY 
            r.round_number DESC, 
            i.order_item_id`,
        Number(table?.id));

        if (active) setItems(rows);

      } catch { if (active) setItems([]); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [db, table?.id, refreshKey]));

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
        <Text style={[styles.statusBadge, styles[`status_${item.status}`]]}>{STATUS_LABEL[item.status] || item.status}</Text>
      </View>
      <Text style={styles.itemLine}>รอบที่ {item.round_number} · {item.unit_price * item.quantity} บาท</Text>
      {item.note ?
        <Text style={styles.noteLine}>{item.note}</Text> : null}
      {item.status === 'waiting' ?
        <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancelItem(item.id)}>
          <Text style={styles.cancelText}>ยกเลิกรายการ</Text>
        </TouchableOpacity> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>ออเดอร์ · โต๊ะ {table?.name || '-'}</Text>
      {loading ?
        <ActivityIndicator /> : items.length === 0 ?
          <Text style={styles.emptyText}>โต๊ะนี้ยังไม่มีออเดอร์</Text> :
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 70 }} />
      }

      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem} onPress={onGoTables}>
          <Text style={{ fontSize: 24, opacity: 0.5 }}>🏠</Text>
          <Text style={styles.navText}>หน้าแรก</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Text style={{ fontSize: 24, opacity: 1 }}>📋</Text>
          <Text style={[styles.navText, {color: "#FF8C00"}]}>ออเดอร์</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onGoBill}>
          <Text style={{ fontSize: 24, opacity: 0.5 }}>🧾</Text>
          <Text style={styles.navText}>บิล</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}