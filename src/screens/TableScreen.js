import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../styles/menuStyle';

export default function TableScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>หน้าเลือกโต๊ะ</Text>

      <TouchableOpacity
        style={{
          marginTop: 24,
          backgroundColor: '#2f6fed',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate('Menu')}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>ไปที่เมนูอาหาร</Text>
      </TouchableOpacity>
    </View>
  );
import { View, Text, FlatList, Image, Pressable, } from "react-native";

import { useState } from "react";

import { styles } from "../styles/tableStyle";
import { Tables } from "../data/tablesdata";

const zones = ["A", "B", "C", "D", "E"];

export default function TableScreen() {

    const [selectedZone, setSelectedZone] = useState("A");
    const [tableData, setTableData] = useState(Tables);


    const filteredTables = tableData.filter(
        (table) => table.zone === selectedZone
    )

    const handleTablePress = (table) => {

        setTableData((currentTables) =>
            currentTables.map((item) => {
                if (item.id === table.id) {
                    return {
                        ...item, status: item.status === "available" ? "occupied" : "available",
                    };
                }
                return item;
            })
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.textHeader}>
                    หน้าเลือกโต๊ะ
                </Text>
            </View>


            {/* Zone */}
            <View style={styles.zoneTab}>

                {zones.map((zone) => (

                    <Pressable
                        key={zone}
                        onPress={() => setSelectedZone(zone)}
                        style={[
                            styles.zoneButton,
                            selectedZone === zone && styles.zoneButtonActive
                        ]}
                    >

                        <Text
                            style={[
                                styles.zoneText,
                                selectedZone === zone && styles.zoneTextActive
                            ]}
                        >
                            โซน {zone}
                        </Text>

                    </Pressable>

                ))}

            </View>

            <FlatList
                data={filteredTables}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (

                    <Pressable
                        style={styles.tableContainer}
                        onPress={() => handleTablePress(item)}
                    >

                        <Image
                            source={{ uri: item.uri }}
                            style={styles.tableImage}
                        />

                        <View style={styles.tableNameContainer}>

                            <Text style={styles.tableName}>
                                โต๊ะ {item.name}
                            </Text>

                        </View>

                        <View
                            style={[
                                styles.statusContainer,
                                item.status === "occupied"
                                    ? styles.statusOccupied
                                    : styles.statusAvailable
                            ]}
                        >

                            <Text style={styles.statusText}>
                                {item.status === "occupied"
                                    ? "เปิดบิลอยู่"
                                    : "ว่าง"}
                            </Text>

                        </View>

                    </Pressable>

                )}
            />
            <Pressable
                style={styles.kitchenButton}
                onPress={() => console.log("ไปหน้าครัว")}
            >

                <Text style={styles.kitchenText}>
                    ฝั่งครัว
                </Text>

            </Pressable>

        </View>
    );
}