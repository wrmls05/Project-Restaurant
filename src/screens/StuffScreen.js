import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/StuffStyle';

export default function StuffScreen({ navigation, onStartOrder }) {
  const handleViewOrders = () => {
    navigation.navigate('QueOrderScreen');
  };

  const handleViewBills = () => {
    navigation.navigate('AllBillsScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ส่วนหัว Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>ฝั่งครัวและพนักงาน</Text>
            <Text style={styles.headerSubtitle}>เลือกงานที่ต้องการทำ</Text>
          </View>
          <TouchableOpacity style={styles.iconCircleButton}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* การ์ดหลัก: เริ่มรับออเดอร์ */}
        <TouchableOpacity
          style={styles.mainCard}
          onPress={onStartOrder}
          activeOpacity={0.85}
        >
          <View style={styles.plusIconCircle}>
            <Text style={styles.plusIconText}>+</Text>
          </View>
          <View>
            <Text style={styles.mainCardTitle}>เริ่มรับออเดอร์</Text>
            <Text style={styles.mainCardSubtitle}>
              เลือกโต๊ะแล้วจดรายการอาหาร
            </Text>
          </View>
        </TouchableOpacity>

        {/* การ์ดรอง 2 ใบด้านล่าง */}
        <View style={styles.secondaryRow}>
          {/* การ์ด: ดูคิวออเดอร์ */}
          <TouchableOpacity
            style={styles.subCard}
            onPress={handleViewOrders}
            activeOpacity={0.8}
          >
            <View style={styles.subCardIconCircle}>
              <Text style={{ fontSize: 18 }}>☰</Text>
            </View>
            <Text style={styles.subCardTitle}>ดูคิวออเดอร์</Text>
          </TouchableOpacity>

          {/* การ์ด: ดูบิลทั้งหมด */}
          <TouchableOpacity
            style={styles.subCard}
            onPress={handleViewBills}
            activeOpacity={0.8}
          >
            <View style={styles.subCardIconCircle}>
              <Text style={{ fontSize: 18 }}>🧾</Text>
            </View>
            <Text style={styles.subCardTitle}>ดูบิลทั้งหมด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}