import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/menuStyle';

export default function BillScreen({ db, table, route, onGoTables, onGoMenu, onGoOrder, refreshKey }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const billId = route?.params?.billId;
  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const bill = billId
          ? await db.getFirstAsync('SELECT bill_id FROM bills WHERE bill_id=?', Number(billId))
          : await db.getFirstAsync("SELECT bill_id FROM bills WHERE table_id=? AND status='open' ORDER BY bill_id DESC LIMIT 1", Number(table?.id));
        if (!bill) { if (active) setRounds([]); return; }
        const rows = await db.getAllAsync(`SELECT r.round_number, i.order_item_id AS id, m.name, i.quantity, i.unit_price, i.note, i.status
          FROM order_rounds r JOIN order_items i ON i.round_id=r.round_id JOIN menu_items m ON m.menu_item_id=i.menu_item_id
          WHERE r.bill_id=? ORDER BY r.round_number, i.order_item_id`, bill.bill_id);
        const grouped = rows.reduce((result, row) => {
          let round = result.find((entry) => entry.round_number === row.round_number);
          if (!round) { round = { round_number: row.round_number, items: [] }; result.push(round); }
          round.items.push(row);
          return result;
        }, []);
        if (active) setRounds(grouped);
      } catch { if (active) setRounds([]); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [db, table?.id, billId, refreshKey]));

  const total = rounds.reduce((sum, round) => sum + round.items.reduce((subtotal, item) => subtotal + (item.status === 'cancelled' ? 0 : Number(item.unit_price) * Number(item.quantity)), 0), 0);
  return <SafeAreaView style={styles.container}>
    <Text style={styles.heading}>บิล · โต๊ะ {table?.name || '-'}</Text>
    {loading ? <ActivityIndicator /> : <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
      {rounds.length === 0 ? <Text style={styles.emptyText}>โต๊ะนี้ยังไม่มีรายการที่ยืนยัน</Text> : rounds.map((round) => <View key={round.round_number} style={{ marginBottom: 16 }}>
        <Text style={styles.itemName}>รอบที่ {round.round_number}</Text>
        {round.items.map((item) => <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, item.status === 'cancelled' && styles.cancelledLine]}>{item.name} × {item.quantity}</Text>
            <Text style={styles.itemLine}>{Number(item.unit_price) * Number(item.quantity)} บาท</Text>
            {item.note ? <Text style={styles.noteLine}>{item.note}</Text> : null}
            {item.status === 'cancelled' ? <Text style={styles.noteLine}>ยกเลิกแล้ว · ไม่นำมาคิดเงิน</Text> : null}
          </View>
        </View>)}
      </View>)}
      {rounds.length > 0 ? <Text style={[styles.itemName, { textAlign: 'right', marginTop: 8 }]}>ยอดสุทธิ {total} บาท</Text> : null}
    </ScrollView>}
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={onGoTables}><Text style={styles.navText}>เลือกโต๊ะ</Text></TouchableOpacity>
      <TouchableOpacity onPress={onGoMenu}><Text style={styles.navText}>เพิ่มเมนู</Text></TouchableOpacity>
      <TouchableOpacity onPress={onGoOrder}><Text style={styles.navText}>ออเดอร์</Text></TouchableOpacity>
    </View>
  </SafeAreaView>;
}
