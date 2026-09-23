import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/menuStyle';

const STATUS_LABEL = {
  waiting: 'รอทำ',
  cooking: 'กำลังทำ',
  served: 'เสิร์ฟแล้ว',
  cancelled: 'ยกเลิกแล้ว',
};

// props: rounds (confirmedRounds จาก App.js), onCancelItem(itemId), onGoMenu, onGoBill
// ตอนนี้สถานะจะขยับจาก waiting -> cooking -> served ได้ก็ต่อเมื่อมีหน้าครัว (ยังไม่ทำ)
// เลยยังเห็นเป็น "รอทำ" ตลอดจนกว่าจะสร้างหน้านั้น — ยกเลิกได้ก็ต่อเมื่อยังอยู่สถานะนี้เท่านั้น
export default function StatusOrderScreen({ route, rounds, onCancelItem, onGoMenu, onGoBill }) {
  const navigation = useNavigation();
  const safeRounds = Array.isArray(rounds)
    ? rounds
    : Array.isArray(route?.params?.rounds)
      ? route.params.rounds
      : [];

  const flatItems = safeRounds.flatMap((round) =>
    (Array.isArray(round?.items) ? round.items : []).map((item) => ({
      ...item,
      round_number: round.round_number,
    }))
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.itemName}>
          {item.name} x{item.quantity}
        </Text>
        <Text style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          {STATUS_LABEL[item.status] || item.status}
        </Text>
      </View>
      <Text style={styles.itemLine}>
        รอบที่ {item.round_number} • ราคา {item.unit_price * item.quantity} บาท
      </Text>
      {item.note ? <Text style={styles.noteLine}>หมายเหตุ: {item.note}</Text> : null}

      {item.status === 'waiting' && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => {
            if (onCancelItem) onCancelItem(item._id);
          }}
        >
          <Text style={styles.cancelBtnText}>ยกเลิกรายการนี้</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>หน้าตรวจสอบสถานะออเดอร์</Text>

      {flatItems.length === 0 ? (
        <Text style={styles.emptyText}>ยังไม่มีออเดอร์ที่สั่งไป</Text>
      ) : (
        <FlatList
          data={flatItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => {
          if (onGoMenu) {
            onGoMenu();
            return;
          }
          navigation.navigate('Menu');
        }}>
          <Text style={styles.navText}>หน้าแรก</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StatusOrder', { rounds: safeRounds })}>
          <Text style={styles.navText}>ออเดอร์</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (onGoBill) {
            onGoBill();
            return;
          }
          navigation.navigate('Bill', { rounds: safeRounds });
        }}>
          <Text style={styles.navText}>บิล</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}