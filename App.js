import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
import StuffScreen from './src/screens/StuffScreen';
import QueOrderScreen from './src/screens/QueOrderScreen';
import AllBillsScreen from './src/screens/AllBillsScreen';
 
const Stack = createNativeStackNavigator();
 
export default function App() {
  const [activeTable, setActiveTable] = useState(null);
  const [ordersByTable, setOrdersByTable] = useState({});
  const [cart, setCart] = useState([]);

  const tableId = activeTable?.id;
  const rounds = tableId ? ordersByTable[tableId] || [] : [];

  const goToMenu = (navigation) => {
    navigation.navigate('Menu', { table: activeTable });
  };

  const goToOrders = (navigation) => {
    navigation.navigate('StatusOrder', { table: activeTable });
  };

  const goToBill = (navigation) => {
    navigation.navigate('Bill', { table: activeTable });
  };

  const confirmOrder = (items, navigation) => {
    if (!tableId || items.length === 0) return;

    const nextRound = {
      round_number: rounds.length + 1,
      items: items.map((item, index) => ({
        ...item,
        _id: `${tableId}-${Date.now()}-${index}`,
        status: 'waiting',
      })),
    };

    setOrdersByTable((current) => ({
      ...current,
      [tableId]: [...(current[tableId] || []), nextRound],
    }));
    setCart([]);
    navigation.navigate('StatusOrder', { table: activeTable });
  };

  const cancelOrderItem = (itemId) => {
    if (!tableId) return;

    setOrdersByTable((current) => ({
      ...current,
      [tableId]: (current[tableId] || []).map((round) => ({
        ...round,
        items: round.items.map((item) =>
          item._id === itemId ? { ...item, status: 'cancelled' } : item
        ),
      })),
    }));
  };

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StuffScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="StuffScreen" component={StuffScreen} />
          <Stack.Screen name="QueOrderScreen" component={QueOrderScreen} />
          <Stack.Screen name="AllBillsScreen" component={AllBillsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}