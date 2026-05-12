import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import HomeScreen from '../screens/HomeScreen';
import ServiceSelectionScreen from '../screens/ServiceSelectionScreen';
import DatePickerScreen from '../screens/DatePickerScreen';
import TimeSlotScreen from '../screens/TimeSlotScreen';
import CustomerDetailsScreen from '../screens/CustomerDetailsScreen';
import BookingSummaryScreen from '../screens/BookingSummaryScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import {BRAND} from '../utils/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: BRAND.primary},
          headerTintColor: BRAND.white,
          headerTitleStyle: {fontWeight: '700', fontSize: 18},
          headerBackTitleVisible: false,
          contentStyle: {backgroundColor: BRAND.surfaceAlt},
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServiceSelection"
          component={ServiceSelectionScreen}
          options={{title: 'Select Service'}}
        />
        <Stack.Screen
          name="DatePicker"
          component={DatePickerScreen}
          options={{title: 'Choose Date'}}
        />
        <Stack.Screen
          name="TimeSlot"
          component={TimeSlotScreen}
          options={{title: 'Choose Time'}}
        />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{title: 'Your Details'}}
        />
        <Stack.Screen
          name="BookingSummary"
          component={BookingSummaryScreen}
          options={{title: 'Review Booking'}}
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{
            title: 'Booking Confirmed',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
