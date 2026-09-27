import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/menuStyle';

export default function BillScreen({ table, rounds = [], onGoTables, onGoMenu, onGoOrder }) {
  const total = rounds.reduce(
    (roundTotal, round) =>
      roundTotal + (round.items || []).reduce((itemTotal, item) => {
        if (item.status === 'cancelled') return itemTotal;
        return itemTotal + Number(item.unit_price || 0) * Number(item.quantity || 0);
      }, 0),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>บิล · โต๊ะ {table?.name || '-'}</Text>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {rounds.length === 0 ? (
          <Text style={styles.emptyText}>โต๊ะนี้ยังไม่มีรายการที่ยืนยัน</Text>
        ) : rounds.map((round) => (
          <View key={round.round_number} style={{ marginBottom: 16 }}>
            <Text style={styles.itemName}>รอบที่ {round.round_number}</Text>
            {(round.items || []).map((item) => (
              <View key={item._id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={[
                    styles.itemName,
                    item.status === 'cancelled' && styles.cancelledLine,
                  ]}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={styles.itemLine}>
                    {Number(item.unit_price || 0) * Number(item.quantity || 0)} บาท
                  </Text>
                  {item.note ? <Text style={styles.noteLine}>{item.note}</Text> : null}
                  {item.status === 'cancelled' ? (
                    <Text style={styles.noteLine}>ยกเลิกแล้ว · ไม่นำมาคิดเงิน</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ))}
        {rounds.length > 0 ? (
          <Text style={[styles.itemName, { textAlign: 'right', marginTop: 8 }]}>
            ยอดสุทธิ {total} บาท
          </Text>
        ) : null}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={onGoTables}><Text style={styles.navText}>เลือกโต๊ะ</Text></TouchableOpacity>
        <TouchableOpacity onPress={onGoMenu}><Text style={styles.navText}>เพิ่มเมนู</Text></TouchableOpacity>
        <TouchableOpacity onPress={onGoOrder}><Text style={styles.navText}>ออเดอร์</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
