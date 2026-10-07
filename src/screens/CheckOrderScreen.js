import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/menuStyle';

export default function CheckOrderScreen({ table, cart = [], onCancel, onConfirm }) {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0),
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImage}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImagePhoto} resizeMode="cover" />
        ) : (
          <Text style={styles.itemImageText}>รูปอาหาร</Text>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemLine}>จำนวน {item.quantity} · {item.unit_price} บาท/ชิ้น</Text>
        {item.note ? <Text style={styles.noteLine}>{item.note}</Text> : null}
        <Text style={styles.itemLine}>
          รวม {Number(item.unit_price || 0) * Number(item.quantity || 0)} บาท
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>ตรวจสอบออเดอร์ · โต๊ะ {table?.name || '-'}</Text>
      <Text style={styles.subheading}>รายการทั้งหมดในรอบนี้</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>ยังไม่มีรายการ กรุณากลับไปเลือกเมนู</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => `${item.menu_item_id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}

      <Text style={styles.total}>ยอดรวม {total} บาท</Text>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>กลับไปเลือกเมนู</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmBtn, cart.length === 0 && styles.confirmBtnDisabled]}
          onPress={() => onConfirm?.(cart)}
          disabled={cart.length === 0}
        >
          <Text style={styles.confirmText}>ยืนยันออเดอร์</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
