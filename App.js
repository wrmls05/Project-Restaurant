import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import TableScreen from './src/screens/TableScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <TableScreen />
    </>
  );
}
