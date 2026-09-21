import { View, Text } from "react-native";

import { styles } from '../styles/tableStyle'

export default function TableScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>หน้าเลือกโต๊ะ</Text>
        </View>
    )
}