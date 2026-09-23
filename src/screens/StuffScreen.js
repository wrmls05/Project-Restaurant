import { View, Text, TouchableOpacity } from "react-native";
 
import { styles } from '../styles/StuffStyle'
 
export default function StuffScreen({ navigation }) {
 
    const handleViewOrders = () => {
        navigation.navigate('QueOrderScreen')
    }
 
    const handleViewBills = () => {
        navigation.navigate('AllBillsScreen')
    }
 
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>ฝั่งครัวและพนักงาน</Text>
 
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleViewOrders}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>ดูคิวออเดอร์</Text>
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleViewBills}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>ดูบิลทั้งหมด</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}