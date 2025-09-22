import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/pages/Main';
import ShiftDetail from './src/pages/ShiftDetail';

import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Main,
    Detail: ShiftDetail,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Navigation />
    </SafeAreaProvider>
  );
}
