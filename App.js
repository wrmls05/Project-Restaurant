import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TableScreen from './src/screens/TableScreen';
import MenuScreen from './src/screens/MenuScreen';
import CheckOrderScreen from './src/screens/CheckOrderScreen';
import StatusOrderScreen from './src/screens/StatusOrderScreen';
import BillScreen from './src/screens/BillScreen';

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
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Table" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Table">
          {(props) => (
            <TableScreen
              {...props}
              ordersByTable={ordersByTable}
              onSelectTable={(table) => {
                setActiveTable(table);
                setCart([]);
                props.navigation.navigate('Menu', { table });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Menu">
          {(props) => (
            <MenuScreen
              {...props}
              table={activeTable}
              cart={cart}
              onCartChange={setCart}
              onGoTables={() => props.navigation.navigate('Table')}
              onGoBill={() => goToBill(props.navigation)}
              onGoOrder={() => goToOrders(props.navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CheckOrder">
          {(props) => (
            <CheckOrderScreen
              {...props}
              table={activeTable}
              cart={cart}
              onCancel={() => props.navigation.goBack()}
              onConfirm={(items) => confirmOrder(items, props.navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StatusOrder">
          {(props) => (
            <StatusOrderScreen
              {...props}
              table={activeTable}
              rounds={rounds}
              onCancelItem={cancelOrderItem}
              onGoTables={() => props.navigation.navigate('Table')}
              onGoMenu={() => goToMenu(props.navigation)}
              onGoBill={() => goToBill(props.navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Bill">
          {(props) => (
            <BillScreen
              {...props}
              table={activeTable}
              rounds={rounds}
              onGoTables={() => props.navigation.navigate('Table')}
              onGoMenu={() => goToMenu(props.navigation)}
              onGoOrder={() => goToOrders(props.navigation)}
            />
          )}
        </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
