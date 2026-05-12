import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, BooklySlot, TimeSlot} from '../types';
import TimeSlotButton from '../components/TimeSlotButton';
import PrimaryButton from '../components/PrimaryButton';
import StepIndicator from '../components/StepIndicator';
import {getAvailableTimeSlots} from '../api/booklyApi';
import {BRAND} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'TimeSlot'>;

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function TimeSlotScreen({navigation, route}: Props) {
  const {service, date} = route.params;
  const [slots, setSlots] = useState<BooklySlot[]>([]);
  const [selected, setSelected] = useState<BooklySlot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvailableTimeSlots(service.booklyId, date)
      .then(setSlots)
      .catch(() =>
        Alert.alert('Error', 'Unable to load time slots. Please go back and try again.'),
      )
      .finally(() => setLoading(false));
  }, [service.booklyId, date]);

  function handleNext() {
    if (!selected) {return;}
    const timeSlot: TimeSlot = {
      time: selected.start.split(' ')[1]?.substring(0, 5) ?? '09:00',
      available: true,
      staffId: selected.staff_id,
    };
    navigation.navigate('CustomerDetails', {service, date, timeSlot});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepIndicator currentStep={3} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.dateLabel}>{formatDisplayDate(date)}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={BRAND.primary} />
            <Text style={styles.loadingText}>Loading available times...</Text>
          </View>
        ) : slots.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No slots available for this date.</Text>
            <Text style={styles.emptySubtext}>
              Please go back and choose a different day.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Available times</Text>
            <View style={styles.slotsGrid}>
              {slots.map(slot => (
                <TimeSlotButton
                  key={slot.start}
                  slot={slot}
                  selected={selected?.start === slot.start}
                  onPress={setSelected}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Enter Your Details →"
          onPress={handleNext}
          disabled={!selected}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.surfaceAlt},
  scroll: {padding: 20, paddingBottom: 0},
  header: {
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BRAND.border,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND.primary,
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND.textPrimary,
  },
  loadingWrap: {alignItems: 'center', paddingVertical: 40},
  loadingText: {marginTop: 12, fontSize: 13, color: BRAND.textSecondary},
  emptyWrap: {alignItems: 'center', paddingVertical: 40},
  emptyIcon: {fontSize: 40, marginBottom: 12},
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.textPrimary,
    marginBottom: 6,
  },
  emptySubtext: {fontSize: 13, color: BRAND.textSecondary, textAlign: 'center'},
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  footer: {
    padding: 20,
    backgroundColor: BRAND.surface,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
  },
});
