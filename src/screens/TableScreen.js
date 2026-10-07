// src/screens/TableScreen.js
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/tableStyle';
import { Tables } from '../database/tablesdata';

const ZONES = ['A', 'B', 'C', 'D', 'E'];

export default function TableScreen({ navigation, db, refreshKey, onSelectTable }) {
  const [selectedZone, setSelectedZone] = useState('A');
  const [occupiedTables, setOccupiedTables] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      db.getAllAsync("SELECT table_id FROM bills WHERE status='open'")
        .then((rows) => {
          if (active) {
            setOccupiedTables(
              Object.fromEntries(rows.map((row) => [String(row.table_id), true]))
            );
          }
        })
        .catch(() => {
          if (active) setOccupiedTables({});
        });
      return () => {
        active = false;
      };
    }, [db, refreshKey])
  );

  const visibleTables = useMemo(
    () => Tables.filter((table) => table.zone === selectedZone),
    [selectedZone]
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgColor = isDarkMode ? styles.containerDark : styles.containerLight;
  const textColor = isDarkMode ? styles.textDark : styles.textLight;
  const subTextColor = isDarkMode ? styles.subTextDark : styles.subTextLight;
  const cardColor = isDarkMode ? styles.tableCardDark : styles.tableCardLight;
  const imageBgColor = isDarkMode ? styles.imageContainerDark : styles.imageContainerLight;

  const renderTable = ({ item }) => {
    const isOccupied = !!occupiedTables[item.id];

    return (
      <Pressable
        style={[styles.tableCard, cardColor]}
        onPress={() => onSelectTable?.(item)}
      >
        <View style={[styles.imageContainer, imageBgColor]}>
          <Image source={{ uri: item.uri }} style={styles.tableImage} resizeMode="contain" />
        </View>
        <Text style={[styles.tableName, textColor]}>โต๊ะ {item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            isOccupied ? styles.badgeOccupied : styles.badgeAvailable,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isOccupied ? styles.statusTextOccupied : styles.statusTextAvailable,
            ]}
          >
            {isOccupied ? '● มีออเดอร์' : '● ว่าง'}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, bgColor]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, textColor]}>เลือกโต๊ะ</Text>
            <Text style={[styles.headerSubtitle, subTextColor]}>
              แตะโต๊ะที่ว่างเพื่อเริ่มรับออเดอร์
            </Text>
          </View>
          <TouchableOpacity style={[styles.iconCircleButton, cardColor]} onPress={toggleTheme}>
            <Text style={{ fontSize: 18 }}>{isDarkMode ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Zone Tabs */}
        <View style={styles.zoneWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ZONES.map((zone) => (
              <Pressable
                key={zone}
                onPress={() => setSelectedZone(zone)}
                style={[
                  styles.zonePill,
                  selectedZone === zone && styles.zonePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.zoneText,
                    selectedZone === zone && styles.zoneTextActive,
                  ]}
                >
                  โซน {zone}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Tables Grid */}
        <FlatList
          data={visibleTables}
          keyExtractor={(table) => table.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={renderTable}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, cardColor]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('StuffScreen')}
        >
          <Text style={[styles.backButtonText, textColor]}>ย้อนกลับ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}