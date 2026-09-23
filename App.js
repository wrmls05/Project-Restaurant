import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
import StuffScreen from './src/screens/StuffScreen';
import QueOrderScreen from './src/screens/QueOrderScreen';
import AllBillsScreen from './src/screens/AllBillsScreen';
 
const Stack = createNativeStackNavigator();
 
export default function App() {
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