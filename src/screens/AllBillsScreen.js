import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/Billsstyle';

export default function AllBillsScreen({ navigation, db, refreshKey, onCloseBill, onOpenBill }) {
  const [activeTab, setActiveTab] = useState('open');
  const [bills, setBills] = useState([]);
  useFocusEffect(useCallback(() => {
    let active = true;
    db.getAllAsync(`SELECT b.bill_id, b.table_id, b.opened_at, b.closed_at, b.status,
      COALESCE(SUM(CASE WHEN i.status <> 'cancelled' THEN i.quantity * i.unit_price ELSE 0 END), 0) AS total,
      COUNT(i.order_item_id) AS item_count
      FROM bills b LEFT JOIN order_rounds r ON r.bill_id=b.bill_id LEFT JOIN order_items i ON i.round_id=r.round_id
      GROUP BY b.bill_id ORDER BY CASE b.status WHEN 'open' THEN 0 ELSE 1 END, b.opened_at DESC`)
      .then((rows) => { if (active) setBills(rows); }).catch(() => { if (active) setBills([]); });
    return () => { active = false; };
  }, [db, refreshKey]));
  const filtered = bills.filter((bill) => bill.status === activeTab);
  const confirmClose = (bill) => Alert.alert('ปิดบิลโต๊ะ ' + bill.table_id, `ยอดสุทธิ ${bill.total} บาท ยืนยันปิดบิลหรือไม่?`, [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ปิดบิล', style: 'destructive', onPress: () => onCloseBill(bill.bill_id) },
  ]);
  const renderBill = ({ item }) => <View style={[styles.card, { height: undefined, minHeight: 130, padding: 16, backgroundColor: '#f3f3f3' }]}>
    <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 6 }}>โต๊ะ {item.table_id} · {item.status === 'open' ? 'ยังเปิดอยู่' : 'ปิดแล้ว'}</Text>
    <Text>ยอดสุทธิ {item.total} บาท · {item.item_count} รายการ</Text>
    <Text style={{ color: '#666', marginTop: 4 }}>{new Date(item.opened_at).toLocaleString()}</Text>
    <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
      <TouchableOpacity onPress={() => onOpenBill(item)}><Text style={{ color: '#2463c7' }}>ดูรายละเอียด</Text></TouchableOpacity>
      {item.status === 'open' ? <TouchableOpacity onPress={() => confirmClose(item)}><Text style={{ color: '#c0392b', fontWeight: '600' }}>ปิดบิล</Text></TouchableOpacity> : null}
    </View>
  </View>;
  return <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.header}>หน้าบิลทั้งหมด</Text>
      <View style={styles.tabRow}>
        {['open', 'closed'].map((tab) => <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab === 'open' ? 'บิลที่ยังอยู่' : 'บิลที่ปิดแล้ว'}</Text>
          {activeTab === tab ? <View style={styles.tabUnderline} /> : null}
        </TouchableOpacity>)}
      </View>
      <FlatList data={filtered} keyExtractor={(bill) => String(bill.bill_id)} renderItem={renderBill} contentContainerStyle={styles.listContent} ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>ไม่มีบิลในรายการนี้</Text>} />
    </View>
    <TouchableOpacity style={styles.bottomBar} onPress={() => navigation.navigate('StuffScreen')}><Text style={styles.bottomBarText}>ย้อนกลับ</Text></TouchableOpacity>
  </View>;
}
