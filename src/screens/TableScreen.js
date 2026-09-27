import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';

import { styles } from '../styles/tableStyle';
import { Tables } from '../data/tablesdata';

const ZONES = ['A', 'B', 'C', 'D', 'E'];

export default function TableScreen({ ordersByTable = {}, onSelectTable }) {
  const [selectedZone, setSelectedZone] = useState('A');
  const visibleTables = useMemo(
    () => Tables.filter((table) => table.zone === selectedZone),
    [selectedZone]
  );

  const renderTable = ({ item }) => {
    const isOccupied = (ordersByTable[item.id] || []).length > 0;

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
        data={visibleTables}
        keyExtractor={(table) => table.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderTable}
      />
    </View>
  );
}
