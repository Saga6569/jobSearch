import './global.css';
// simport { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/pages/Main';
import ShiftDetail from './src/pages/ShiftDetail';

import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Main,
    ShiftDetail: ShiftDetail,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
