import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/OrderStyle';

const label = { waiting: 'รอทำ', cooking: 'กำลังทำ', served: 'เสิร์ฟแล้ว', cancelled: 'ยกเลิก' };

export default function QueOrdersScreen({ navigation, db, refreshKey, onSetStatus }) {

  const [items, setItems] = useState([]);
  
  useFocusEffect(useCallback(() => {
    let active = true;
    db.getAllAsync(`
      SELECT 
        i.order_item_id, 
        i.quantity, 
        i.unit_price, 
        i.note, 
        i.status, 
        r.round_number,
        b.table_id, 
        m.name, 
        r.ordered_at 
      FROM order_items i 
      JOIN order_rounds r ON r.round_id=i.round_id
      JOIN bills b ON b.bill_id=r.bill_id 
      JOIN menu_items m ON m.menu_item_id=i.menu_item_id
      WHERE b.status='open'
        ORDER BY
          CASE i.status 
          WHEN 'waiting' THEN 0 
          WHEN 'cooking' THEN 1 
          ELSE 2 
        END, 
        r.ordered_at, 
        i.order_item_id`
    )
      .then((rows) => { if (active) setItems(rows); }).catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, [db, refreshKey]));

  const renderOrder = ({ item }) =>
    <View style={[styles.card, { height: undefined, minHeight: 130, padding: 16, backgroundColor: '#f2f2f2' }]}>

      <Text style={{ fontWeight: '700', fontSize: 17 }}>โต๊ะ {item.table_id} · รอบ {item.round_number}</Text>

      <Text style={{ fontSize: 16, marginTop: 8 }}>{item.name} × {item.quantity}</Text>

      <Text style={{ color: '#555' }}>สถานะ: {label[item.status] || item.status}</Text>

      {item.note ?
        <Text style={{ color: '#555', marginTop: 4 }}>หมายเหตุ: {item.note}</Text> : null}

      {item.status === 'waiting' ?
        <TouchableOpacity style={{ marginTop: 12, padding: 10, backgroundColor: '#2f6fed', borderRadius: 6 }} onPress={() => onSetStatus(item.order_item_id, 'cooking')}>

          <Text style={{ color: '#fff', textAlign: 'center' }}>เริ่มทำ</Text>
        </TouchableOpacity> : null}

      {item.status === 'cooking' ?
        <TouchableOpacity style={{ marginTop: 12, padding: 10, backgroundColor: '#27ae60', borderRadius: 6 }} onPress={() => onSetStatus(item.order_item_id, 'served')}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>ทำเสร็จ / เสิร์ฟแล้ว</Text>
        </TouchableOpacity> : null}

    </View>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>คิวออเดอร์ครัว</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.order_item_id)}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>ยังไม่มีออเดอร์ที่เปิดอยู่</Text>} />
      </View>
      <TouchableOpacity
        style={styles.bottomBar} onPress={() => navigation.navigate('StuffScreen')}>
        <Text style={styles.bottomBarText}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </View>
  )
}
