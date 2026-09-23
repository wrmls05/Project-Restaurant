import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';

import { styles } from '../styles/menuStyle';
import AddonModal from '../components/AddonModal';
import { CATEGORIES, MENU_ITEMS } from '../database/menuData';

// onSubmitOrder(cart): callback ตอนกด "ยืนยันออเดอร์"
// ถ้าไม่ส่ง prop มา จะ Alert สรุปแทน (ยังไม่ insert ลง order_rounds/order_items จริง
// เพราะหน้านี้ยังไม่มี bill_id/round_id ส่งเข้ามา — ต่อได้ตอนเชื่อมกับหน้าเลือกโต๊ะ/เปิดบิล)
export default function MennuScreen({ navigation, onSubmitOrder, onGoBill, onGoOrder }) {
  const activeCategories = CATEGORIES.filter((c) => c.is_active);
  const [activeCategoryId, setActiveCategoryId] = useState(activeCategories[0]?.category_id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]); // เก็บ order_item ที่ยังไม่ยืนยัน (shape ตรงกับ order_items)

  const filteredItems = MENU_ITEMS.filter(
    (m) => m.category_id === activeCategoryId && m.is_available
  );

  const handleConfirmAddon = (orderItem) => {
    setCart((prev) => {
      const nextCart = [...prev, orderItem];
      if (onSubmitOrder) {
        onSubmitOrder(nextCart);
      }
      if (navigation) {
        navigation.navigate('CheckOrder', { cart: nextCart });
      }
      return nextCart;
    });
    setSelectedItem(null);
  };

  const cartTotal = cart.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);

  const handleSubmit = () => {
    if (cart.length === 0) return;

    if (onSubmitOrder) {
      onSubmitOrder(cart);
    }

    if (navigation) {
      navigation.navigate('CheckOrder', { cart });
    }

    setCart([]);
  };

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
        <Text style={styles.itemPrice}>ราคา : {item.price} บาท</Text>
        <TouchableOpacity style={styles.selectBtn} onPress={() => setSelectedItem(item)}>
          <Text style={styles.selectBtnText}>เลือก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>เลือกรายการอาหาร</Text>

      <View style={styles.tabs}>
        {activeCategories.map((cat) => (
          <TouchableOpacity key={cat.category_id} onPress={() => setActiveCategoryId(cat.category_id)}>
            <Text style={[styles.tabText, activeCategoryId === cat.category_id && styles.tabTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.menu_item_id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <AddonModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={handleConfirmAddon}
      />

      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {cart.length > 0 ? `${cart.length} รายการ • ${cartTotal} บาท` : 'ยังไม่มีรายการ'}
        </Text>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={cart.length === 0}>
          <Text style={styles.submitBtnText}>ยืนยันออเดอร์</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1f1f1f',
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 16,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>หน้าแรก</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (onGoOrder) {
            onGoOrder();
            return;
          }
          navigation.navigate('StatusOrder');
        }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>ออเดอร์</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (onGoBill) {
            onGoBill();
            return;
          }
          navigation.navigate('Bill');
        }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>บิล</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}