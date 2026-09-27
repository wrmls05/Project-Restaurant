// src/components/AddonModal.js
// popup ตอนกด "เลือก" เมนู — เนื่องจาก schema ไม่มีตาราง addon แยก
// ตัวเลือก (เนื้อสัตว์ / ขวด / สถานะเสิร์ฟ / รายการเพิ่ม) เลยถูกอัดรวมเป็น:
//   - unit_price = ราคาเมนู + ราคารวมของ extras ที่ติ๊ก
//   - note        = คำอธิบายตัวเลือกทั้งหมด ต่อกันเป็นข้อความ
// ผลลัพธ์ที่ onConfirm ส่งออกมา จึง map ตรงกับคอลัมน์ของ order_items ได้เลย
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Image } from 'react-native';
import Dropdown from './Dropdown';

export default function AddonModal({ visible, item, onClose, onConfirm }) {
  const [meat, setMeat] = useState('');
  const [bottle, setBottle] = useState('');
  const [serve, setServe] = useState('');
  const [checkedExtras, setCheckedExtras] = useState({});
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMeat('');
    setBottle('');
    setServe('');
    setCheckedExtras({});
    setNote('');
    setQuantity(1);
  }, [item]);

  if (!item) return null;
  const addon = item.addon || {};
  const hasNote = !!(addon.meatOptions || (addon.extras && addon.extras.length));

  const toggleExtra = (label) => {
    setCheckedExtras((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const extrasTotal = (addon.extras || []).reduce(
    (sum, e) => sum + (checkedExtras[e.label] ? e.price : 0),
    0
  );
  const unitPrice = item.price + extrasTotal;
  const lineTotal = unitPrice * quantity;

  const buildNote = () => {
    const parts = [];
    if (meat) parts.push(`เนื้อ: ${meat}`);
    if (bottle) parts.push(`ขวด: ${bottle}`);
    if (serve) parts.push(`เสิร์ฟ: ${serve}`);
    const extraLabels = (addon.extras || []).filter((e) => checkedExtras[e.label]).map((e) => e.label);
    if (extraLabels.length) parts.push(`เพิ่ม: ${extraLabels.join(', ')}`);
    if (note.trim()) parts.push(note.trim());
    return parts.length ? parts.join(' | ') : null;
  };

  const handleConfirm = () => {
    onConfirm({
      menu_item_id: item.menu_item_id,
      name: item.name,
      image: item.image,
      quantity,
      unit_price: unitPrice,
      note: buildNote(),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.selectedPreview}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.selectedImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>รูป</Text>
              </View>
            )}
            <Text style={styles.selectedName}>{item.name}</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>เมนู - {item.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Select Addons</Text>

          {addon.meatOptions && (
            <Dropdown label="เลือกเนื้อสัตว์" options={addon.meatOptions} value={meat} onChange={setMeat} />
          )}
          {addon.bottleOptions && (
            <Dropdown label="ขวด" options={addon.bottleOptions} value={bottle} onChange={setBottle} />
          )}
          {addon.serveOptions && (
            <Dropdown label="สถานะการเสิร์ฟ" options={addon.serveOptions} value={serve} onChange={setServe} />
          )}

          {addon.extras && addon.extras.length > 0 && (
            <View style={styles.extrasBlock}>
              <Text style={styles.label}>เลือก</Text>
              {addon.extras.map((extra) => (
                <TouchableOpacity
                  key={extra.label}
                  style={styles.checkboxRow}
                  onPress={() => toggleExtra(extra.label)}
                >
                  <View style={[styles.checkbox, checkedExtras[extra.label] && styles.checkboxChecked]} />
                  <Text style={styles.checkboxLabel}>{extra.label}</Text>
                  <Text style={styles.checkboxPrice}>{extra.price} บ.</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {hasNote && (
            <View style={styles.noteBlock}>
              <Text style={styles.label}>หมายเหตุ</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="พิมพ์หมายเหตุ..."
                multiline
              />
            </View>
          )}

          <View style={styles.qtyRow}>
            <Text style={styles.label}>จำนวน</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.total}>รวม: {lineTotal} บาท</Text>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>ตกลง</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 20, maxHeight: '85%' },
  selectedPreview: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  selectedImage: { width: 56, height: 56, borderRadius: 8 },
  placeholderImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#dfe7f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { fontSize: 12, color: '#555' },
  selectedName: { fontSize: 16, fontWeight: '600', color: '#222' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: '#222' },
  close: { fontSize: 16, color: '#888' },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6, color: '#333', fontWeight: '500' },
  extrasBlock: { marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#999', borderRadius: 3, marginRight: 10 },
  checkboxChecked: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  checkboxLabel: { flex: 1, fontSize: 14, color: '#333' },
  checkboxPrice: { fontSize: 13, color: '#666' },
  noteBlock: { marginBottom: 12 },
  noteInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, minHeight: 40, fontSize: 14 },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, color: '#333' },
  qtyValue: { width: 32, textAlign: 'center', fontSize: 15, color: '#222' },
  total: { fontSize: 15, fontWeight: '600', textAlign: 'right', marginBottom: 12, color: '#222' },
  confirmBtn: { backgroundColor: '#2f6fed', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});