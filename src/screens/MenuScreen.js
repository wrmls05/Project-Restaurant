import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../styles/menuStyle';
import AddonModal from '../components/AddonModal';
import { CATEGORIES, MENU_ITEMS } from '../database/menuData';

export default function MenuScreen({
  navigation,
  db,
  table,
  cart = [],
  onCartChange,
  onGoTables,
  onGoOrder,
  onGoBill,
}) {
  const [categories, setCategories] = useState(CATEGORIES);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0]?.category_id);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      db.getAllAsync('SELECT category_id, name, is_active FROM categories ORDER BY category_id'),
      db.getAllAsync('SELECT menu_item_id, category_id, name, price, is_available FROM menu_items ORDER BY menu_item_id'),
    ]).then(([storedCategories, storedItems]) => {
      if (!active) return;
      if (storedCategories.length) setCategories(storedCategories);
      if (storedItems.length) setMenuItems(storedItems.map((stored) => ({
        ...(MENU_ITEMS.find((item) => item.menu_item_id === stored.menu_item_id) || {}),
        ...stored,
      })));
    }).catch(() => {});
    return () => { active = false; };
  }, [db]);

  const activeCategories = useMemo(() => categories.filter((category) => category.is_active), [categories]);

  const visibleItems = menuItems.filter(
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

  const openCart = () => {
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

      {/* แถบสรุป = ตะกร้า */}
      <View style={[styles.summaryBar, { bottom: 65 }]}>
        <Text style={styles.summaryText}>
          {cart.length} รายการ · {cartTotal} บาท
        </Text>
        <TouchableOpacity
          style={[styles.submitBtn, cart.length === 0 && styles.confirmBtnDisabled]}
          onPress={openCart}
          disabled={cart.length === 0}
        >
          <Text style={styles.submitBtnText}>ดูตะกร้า 🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav: หน้าแรก / ออเดอร์ / บิล */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem} onPress={onGoTables}>
          <Text style={{ fontSize: 24, opacity: 0.5 }}>🏠</Text>
          <Text style={styles.navText}>หน้าแรก</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={onGoOrder}>
          <Text style={{ fontSize: 24, opacity: 0.5 }}>📋</Text>
          <Text style={styles.navText}>ออเดอร์</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onGoBill}>
          <Text style={{ fontSize: 24, opacity: 0.5 }}>🧾</Text>
          <Text style={styles.navText}>บิล</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}