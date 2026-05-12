import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {BRAND} from './src/utils/constants';

export default function App() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={BRAND.primary}
      />
      <AppNavigator />
    </>
  );
}
