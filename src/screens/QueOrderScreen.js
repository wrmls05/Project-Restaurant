import { View, Text, TouchableOpacity, FlatList } from "react-native";
 
import { styles } from "../styles/OrderStyle";
 
 
const placeholderOrders = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
]
 
export default function QueOrdersScreen({ navigation }) {
 
    const handleGoBack = () => {
        navigation.navigate('StuffScreen')
    }
 
    const handlePressOrder = (order) => {
        console.log('กดออเดอร์', order.id)
    }
 
    const renderOrderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handlePressOrder(item)}
            activeOpacity={0.7}
        >
        </TouchableOpacity>
    )
 
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>หน้าคิวออเดอร์</Text>
 
                <FlatList
                    data={placeholderOrders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrderCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
 
            <TouchableOpacity
                style={styles.bottomBar}
                onPress={handleGoBack}
                activeOpacity={0.8}
            >
                <Text style={styles.bottomBarText}>ย้อนกลับ</Text>
            </TouchableOpacity>
        </View>
    )
}