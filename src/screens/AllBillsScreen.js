import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
 
import { styles } from "../styles/Billsstyle";
 
const placeholderBills = [
    { id: '1', status: 'open' },
    { id: '2', status: 'open' },
    { id: '3', status: 'closed' },
]
 
const TABS = {
    OPEN: 'open',
    CLOSED: 'closed',
}
 
export default function AllBillsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState(TABS.OPEN)
 
    const handleGoBack = () => {
        navigation.navigate('StuffScreen')
    }
 
    const handlePressBill = (bill) => {
        console.log('กดบิล', bill.id)
    }
 
    const filteredBills = placeholderBills.filter((bill) => bill.status === activeTab)
 
    const renderBillCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handlePressBill(item)}
            activeOpacity={0.7}
        >
        </TouchableOpacity>
    )
 
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>หน้าบิลทั้งหมด</Text>
 
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => setActiveTab(TABS.OPEN)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.OPEN && styles.tabTextActive]}>
                            บิลที่ยังอยู่
                        </Text>
                        {activeTab === TABS.OPEN && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => setActiveTab(TABS.CLOSED)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.CLOSED && styles.tabTextActive]}>
                            บิลที่ปิดไปแล้ว
                        </Text>
                        {activeTab === TABS.CLOSED && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
                </View>
 
                <FlatList
                    data={filteredBills}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBillCard}
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