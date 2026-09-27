import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles/menuStyle';

const STATUS_LABEL = {
  waiting: 'กำลังรอทำ',
  cooking: 'กำลังทำ',
  served: 'เสิร์ฟแล้ว',
  cancelled: 'ยกเลิกแล้ว',
};

export default function StatusOrderScreen({
  table,
  rounds = [],
  onCancelItem,
  onGoTables,
  onGoMenu,
  onGoBill,
}) {
  const items = rounds.flatMap((round) =>
    (round.items || []).map((item) => ({ ...item, round_number: round.round_number }))
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
        <Text style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          {STATUS_LABEL[item.status] || item.status}
        </Text>
      </View>
      <Text style={styles.itemLine}>
        รอบที่ {item.round_number} · {item.unit_price * item.quantity} บาท
      </Text>
      {item.note ? <Text style={styles.noteLine}>{item.note}</Text> : null}
      {item.status === 'waiting' ? (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => onCancelItem?.(item._id)}
        >
          <Text style={styles.cancelText}>ยกเลิกรายการ</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ออเดอร์ · โต๊ะ {table?.name || '-'}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>โต๊ะนี้ยังไม่มีออเดอร์</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 70 }}
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={onGoTables}><Text style={styles.navText}>เลือกโต๊ะ</Text></TouchableOpacity>
        <TouchableOpacity onPress={onGoMenu}><Text style={styles.navText}>เพิ่มเมนู</Text></TouchableOpacity>
        <TouchableOpacity onPress={onGoBill}><Text style={styles.navText}>บิล</Text></TouchableOpacity>
      </View>
    </View>
  );
}
