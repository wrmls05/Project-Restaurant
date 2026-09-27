// src/components/Dropdown.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

export default function Dropdown({ label, options, value, onChange, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity style={styles.box} onPress={() => setOpen(true)}>
        <Text style={styles.boxText}>{value || placeholder}</Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.dropdownList}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{label || 'Select Addons'}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[placeholder, ...options]}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item === value && styles.optionActive]}
                  onPress={() => {
                    onChange(item === placeholder ? '' : item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4, color: '#333', fontWeight: '500' },
  box: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxText: { fontSize: 14, color: '#333' },
  arrow: { color: '#888' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', paddingHorizontal: 30 },
  dropdownList: { backgroundColor: '#fff', borderRadius: 8, maxHeight: 280, overflow: 'hidden' },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  close: { fontSize: 14, color: '#888' },
  option: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  optionActive: { backgroundColor: '#e6f0ff' },
  optionText: { fontSize: 14, color: '#333' },
});