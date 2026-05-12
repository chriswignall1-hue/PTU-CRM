import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import PrimaryButton from '../components/PrimaryButton';
import StepIndicator from '../components/StepIndicator';
import {createAppointment} from '../api/booklyApi';
import {BRAND, SERVICE_ICONS} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingSummary'>;

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m}${ampm}`;
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({label, value}: SummaryRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function BookingSummaryScreen({navigation, route}: Props) {
  const {service, date, timeSlot, customer} = route.params;
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      const confirmation = await createAppointment({
        serviceId: service.booklyId,
        staffId: timeSlot.staffId,
        date,
        time: timeSlot.time,
        customer,
      });

      confirmation.service = service.name;
      confirmation.customerName = `${customer.firstName} ${customer.lastName}`;

      navigation.navigate('Confirmation', {confirmation});
    } catch (err) {
      Alert.alert(
        'Booking Failed',
        'We were unable to confirm your booking. Please check your connection and try again, or call us directly.',
        [{text: 'OK'}],
      );
    } finally {
      setSubmitting(false);
    }
  }

  const address = [
    customer.addressLine1,
    customer.addressLine2,
    customer.postcode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <SafeAreaView style={styles.safe}>
      <StepIndicator currentStep={5} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.heading}>Review your booking</Text>
        <Text style={styles.subheading}>
          Please check everything looks correct before confirming.
        </Text>

        {/* Service card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>
              {SERVICE_ICONS[service.id]}
            </Text>
            <Text style={styles.cardHeaderTitle}>Service</Text>
          </View>
          <SummaryRow label="Service" value={service.name} />
          <SummaryRow label="Duration" value={`${service.duration} minutes`} />
          <SummaryRow label="Price" value={service.price} />
        </View>

        {/* Date & Time card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>📅</Text>
            <Text style={styles.cardHeaderTitle}>Appointment</Text>
          </View>
          <SummaryRow label="Date" value={formatDisplayDate(date)} />
          <SummaryRow label="Time" value={formatTime(timeSlot.time)} />
        </View>

        {/* Customer card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>👤</Text>
            <Text style={styles.cardHeaderTitle}>Your Details</Text>
          </View>
          <SummaryRow
            label="Name"
            value={`${customer.firstName} ${customer.lastName}`}
          />
          <SummaryRow label="Email" value={customer.email} />
          <SummaryRow label="Phone" value={customer.phone} />
          <SummaryRow label="Address" value={address} />
          {customer.notes ? (
            <SummaryRow label="Notes" value={customer.notes} />
          ) : null}
        </View>

        <Text style={styles.disclaimer}>
          By confirming, you agree to our terms and conditions. A confirmation
          email will be sent to {customer.email}.
        </Text>

        <PrimaryButton
          label={submitting ? 'Confirming...' : 'Confirm Booking'}
          onPress={handleConfirm}
          loading={submitting}
          style={styles.confirmBtn}
        />

        <PrimaryButton
          label="Go Back & Edit"
          onPress={() => navigation.goBack()}
          variant="outline"
          disabled={submitting}
          style={styles.editBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.surfaceAlt},
  scroll: {padding: 20, paddingBottom: 40},
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND.textPrimary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: BRAND.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  cardHeaderIcon: {fontSize: 20},
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 13,
    color: BRAND.textSecondary,
    flex: 1,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  disclaimer: {
    fontSize: 12,
    color: BRAND.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    marginTop: 4,
  },
  confirmBtn: {width: '100%', marginBottom: 12},
  editBtn: {width: '100%'},
});
