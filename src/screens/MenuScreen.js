import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../styles/menuStyle';
import AddonModal from '../components/AddonModal';
import { CATEGORIES, MENU_ITEMS } from '../database/menuData';

export default function MenuScreen({
  navigation,
  table,
  cart = [],
  onCartChange,
  onGoTables,
  onGoBill,
  onGoOrder,
}) {
  const activeCategories = useMemo(
    () => CATEGORIES.filter((category) => category.is_active),
    []
  );
  const [activeCategoryId, setActiveCategoryId] = useState(activeCategories[0]?.category_id);
  const [selectedItem, setSelectedItem] = useState(null);

  const visibleItems = MENU_ITEMS.filter(
    (item) => item.category_id === activeCategoryId && item.is_available
  );
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0),
    0
  );

  const addItemToCart = (item) => {
    onCartChange?.([...cart, item]);
    setSelectedItem(null);
  };

  const openReview = () => {
    if (cart.length > 0) navigation.navigate('CheckOrder');
  };

  const renderMenuItem = ({ item }) => (
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
        <Text style={styles.itemPrice}>{item.price} บาท</Text>
        <TouchableOpacity style={styles.selectBtn} onPress={() => setSelectedItem(item)}>
          <Text style={styles.selectBtnText}>เลือกเมนู</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>เมนูอาหาร · โต๊ะ {table?.name || '-'}</Text>

      <View style={styles.tabs}>
        {activeCategories.map((category) => (
          <TouchableOpacity
            key={category.category_id}
            onPress={() => setActiveCategoryId(category.category_id)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategoryId === category.category_id && styles.tabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => String(item.menu_item_id)}
        renderItem={renderMenuItem}
        contentContainerStyle={{ paddingBottom: 160 }}
      />

      <AddonModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={addItemToCart}
      />

      <View style={[styles.summaryBar, { bottom: 48 }]}>
        <Text style={styles.summaryText}>
          {cart.length} รายการ · {cartTotal} บาท
        </Text>
        <TouchableOpacity
          style={[styles.submitBtn, cart.length === 0 && styles.confirmBtnDisabled]}
          onPress={openReview}
          disabled={cart.length === 0}
        >
          <Text style={styles.submitBtnText}>ตรวจสอบและส่งออเดอร์</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={onGoTables}>
          <Text style={styles.navText}>เลือกโต๊ะ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoOrder}>
          <Text style={styles.navText}>ออเดอร์</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoBill}>
          <Text style={styles.navText}>บิล</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
