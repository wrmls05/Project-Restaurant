import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from '../styles/tableStyle';
import { Tables } from '../database/tablesdata';

const ZONES = ['A', 'B', 'C', 'D', 'E'];

export default function TableScreen({ navigation, db, refreshKey, onSelectTable }) {
  const [selectedZone, setSelectedZone] = useState('A');
  const [occupiedTables, setOccupiedTables] = useState({});
  useFocusEffect(useCallback(() => {
    let active = true;
    db.getAllAsync("SELECT table_id FROM bills WHERE status='open'").then((rows) => {
      if (active) setOccupiedTables(Object.fromEntries(rows.map((row) => [String(row.table_id), true])));
    }).catch(() => { if (active) setOccupiedTables({}); });
    return () => { active = false; };
  }, [db, refreshKey]));
  const visibleTables = useMemo(
    () => Tables.filter((table) => table.zone === selectedZone),
    [selectedZone]
  );

  const renderTable = ({ item }) => {
    const isOccupied = !!occupiedTables[item.id];

    return (
      <Pressable style={styles.tableContainer} onPress={() => onSelectTable?.(item)}>
        <Image source={{ uri: item.uri }} style={styles.tableImage} />
        <View style={styles.tableNameContainer}>
          <Text style={styles.tableName}>โต๊ะ {item.name}</Text>
        </View>
        <View style={[styles.statusContainer, isOccupied ? styles.statusOccupied : styles.statusAvailable]}>
          <Text style={styles.statusText}>{isOccupied ? 'มีออเดอร์' : 'ว่าง'}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>เลือกโต๊ะ</Text>
      </View>

      <View style={styles.zoneTab}>
        {ZONES.map((zone) => (
          <Pressable
            key={zone}
            onPress={() => setSelectedZone(zone)}
            style={[styles.zoneButton, selectedZone === zone && styles.zoneButtonActive]}
          >
            <Text style={[styles.zoneText, selectedZone === zone && styles.zoneTextActive]}>
              โซน {zone}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={visibleTables}
        keyExtractor={(table) => table.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderTable}
      />
      <TouchableOpacity
        style={styles.kitchenButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('StuffScreen')}
      >
        <Text style={styles.kitchenText}>ย้อนกลับ</Text>
      </TouchableOpacity>
    </View>
  );
}
