import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/menuStyle';

// props: cart (pendingCart จาก App.js), onCancel, onConfirm
// เนื่องจาก meat/extras ถูกอัดรวมเป็น note ไว้แล้วตอนเลือกใน AddonModal (ดู order_items schema)
// เลยแสดงเป็นบรรทัด "หมายเหตุ" บรรทัดเดียว แทนที่จะแยกเป็นเนื้อสัตว์ / Addons คนละบรรทัด
export default function CheckOrderScreen({ route, navigation, cart: cartProp, onCancel, onConfirm }) {
  const nav = useNavigation();
  const cart = route?.params?.cart ?? cartProp ?? [];
  const total = cart.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImage}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImagePhoto} resizeMode="cover" />
        ) : (
          <Text style={styles.itemImageText}>รูป</Text>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>ชื่อเมนู : {item.name}</Text>
        <Text style={styles.itemLine}>ราคา : {item.unit_price} บาท</Text>
        <Text style={styles.itemLine}>จำนวน : {item.quantity}</Text>
        <Text style={styles.itemLine}>หมายเหตุ : {item.note || '-'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>หน้าแสดงรายการที่จะสั่ง</Text>
      <Text style={styles.subheading}>ตรวจสอบความถูกต้องก่อนที่จะกดสั่ง</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>ยังไม่มีรายการ — กลับไปเลือกเมนูก่อน</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, idx) => `${item.menu_item_id}-${idx}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {cart.length > 0 && <Text style={styles.total}>รวม: {total} บาท</Text>}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => {
            if (onCancel) {
              onCancel();
            } else {
              (navigation ?? nav).navigate('Menu');
            }
          }}
        >
          <Text style={styles.cancelText}>ยกเลิก</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmBtn, cart.length === 0 && styles.confirmBtnDisabled]}
          onPress={() => {
            if (onConfirm) {
              onConfirm(cart);
            } else {
              const confirmedRounds = [
                {
                  round_number: 1,
                  items: cart.map((item) => ({
                    ...item,
                    _id: `${item.menu_item_id}-${Date.now()}`,
                    status: 'waiting',
                  })),
                },
              ];

              (navigation ?? nav).navigate('StatusOrder', { rounds: confirmedRounds });
            }
          }}
          disabled={cart.length === 0}
        >
          <Text style={styles.confirmText}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}