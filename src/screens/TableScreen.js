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
}