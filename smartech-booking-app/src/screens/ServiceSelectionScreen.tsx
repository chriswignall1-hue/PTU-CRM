import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, Service} from '../types';
import ServiceCard from '../components/ServiceCard';
import StepIndicator from '../components/StepIndicator';
import {BRAND, SERVICES} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceSelection'>;

export default function ServiceSelectionScreen({navigation}: Props) {
  function handleSelect(service: Service) {
    navigation.navigate('DatePicker', {service});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepIndicator currentStep={1} />
      <FlatList
        data={SERVICES}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ServiceCard service={item} onPress={handleSelect} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>What do you need?</Text>
            <Text style={styles.subtitle}>
              Select a service to check availability and book an appointment.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.surfaceAlt},
  list: {padding: 16},
  header: {marginBottom: 16},
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: BRAND.textSecondary,
    lineHeight: 20,
  },
});
