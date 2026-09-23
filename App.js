import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import TableScreen from './src/screens/TableScreen';
import MennuScreen from './src/screens/MenuScreen';
import CheckOrderScreen from './src/screens/CheckOrderScreen';
import StatutOrderScreen from './src/screens/StatutOrderScreen';
import BillScreen from './src/screens/BillScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [pendingCart, setPendingCart] = useState([]);
  const [confirmedRounds, setConfirmedRounds] = useState([]);

  const createOrderRound = (cart) => ({
    round_number: confirmedRounds.length + 1,
    items: cart.map((item, idx) => ({
      ...item,
      _id: `${item.menu_item_id}-${Date.now()}-${idx}`,
      status: 'waiting',
    })),
  });

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Table" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Table" component={TableScreen} />

        <Stack.Screen name="Menu">
          {(props) => (
            <MennuScreen
              {...props}
              onSubmitOrder={(cart) => {
                setPendingCart(cart);
              }}
              onGoBill={() => props.navigation.navigate('Bill', { rounds: confirmedRounds })}
              onGoOrder={() => props.navigation.navigate('StatusOrder', { rounds: confirmedRounds })}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CheckOrder">
          {(props) => (
            <CheckOrderScreen
              {...props}
              cart={pendingCart}
              onCancel={() => {
                setPendingCart([]);
                props.navigation.navigate('Menu');
              }}
              onConfirm={(cart) => {
                const orderCart = Array.isArray(cart) ? cart : pendingCart;
                const nextRound = createOrderRound(orderCart);
                const nextRounds = [...confirmedRounds, nextRound];
                setConfirmedRounds(nextRounds);
                setPendingCart([]);
                props.navigation.navigate('StatusOrder', { rounds: nextRounds });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StatusOrder">
          {(props) => (
            <StatutOrderScreen
              {...props}
              rounds={confirmedRounds}
              onGoMenu={() => props.navigation.navigate('Menu')}
              onGoBill={() => props.navigation.navigate('Bill', { rounds: confirmedRounds })}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Bill">
          {(props) => (
            <BillScreen
              {...props}
              tableNumber={1}
              rounds={confirmedRounds}
              onGoMenu={() => props.navigation.navigate('Menu')}
              onGoOrder={() => props.navigation.navigate('StatusOrder', { rounds: confirmedRounds })}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}