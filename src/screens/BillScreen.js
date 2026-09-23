import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/menuStyle';

export default function BillScreen({ route, tableNumber, rounds, onGoMenu, onGoOrder }) {
  const navigation = useNavigation();
  const safeRounds = Array.isArray(rounds)
    ? rounds
    : Array.isArray(route?.params?.rounds)
      ? route.params.rounds
      : [];

  const grandTotal = safeRounds.reduce(
    (sum, round) =>
      sum +
      (Array.isArray(round?.items) ? round.items : []).reduce(
        (s, i) => (i.status === 'cancelled' ? s : s + (Number(i.unit_price) || 0) * (Number(i.quantity) || 0)),
        0
      ),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>บิล</Text>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }}>
        <Text style={styles.itemPrice}>โต๊ะ: {tableNumber ?? '-'}</Text>

        {safeRounds.length === 0 ? (
          <Text style={styles.emptyText}>ยังไม่มีรายการที่ยืนยัน</Text>
        ) : (
          safeRounds.map((round) => (
            <View key={round.round_number ?? Math.random()} style={{ marginBottom: 12 }}>
              <Text style={styles.itemName}>รอบที่ {round.round_number ?? '-'}</Text>

              {(Array.isArray(round?.items) ? round.items : []).map((item, idx) => (
                <View key={idx} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
                    <Text style={styles.itemPrice}>ราคา: {(Number(item.unit_price) || 0) * (Number(item.quantity) || 0)} บาท</Text>
                    {item.note ? <Text style={styles.noteLine}>หมายเหตุ: {item.note}</Text> : null}
                    {item.status === 'cancelled' ? <Text style={styles.noteLine}>ยกเลิก</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}

        {safeRounds.length > 0 && (
          <Text style={[styles.itemName, { textAlign: 'right', marginTop: 8 }]}>ราคาทั้งหมด {grandTotal} บาท</Text>
        )}
      </ScrollView>

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
        <TouchableOpacity onPress={() => {
          if (onGoOrder) {
            onGoOrder();
            return;
          }
          navigation.navigate('StatusOrder', { rounds: safeRounds });
        }}>
          <Text style={styles.navText}>ออเดอร์</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bill', { rounds: safeRounds })}>
          <Text style={styles.navText}>บิล</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}