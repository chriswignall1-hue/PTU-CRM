import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import PrimaryButton from '../components/PrimaryButton';
import {BRAND} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

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

export default function ConfirmationScreen({navigation, route}: Props) {
  const {confirmation} = route.params;

  async function handleShare() {
    await Share.share({
      message:
        `Booking confirmed with Smartech Gas!\n\n` +
        `Reference: ${confirmation.reference}\n` +
        `Service: ${confirmation.service}\n` +
        `Date: ${formatDisplayDate(confirmation.date)}\n` +
        `Time: ${formatTime(confirmation.time)}\n\n` +
        `Gas Safe registered engineers • Liverpool`,
    });
  }

  function handleBookAnother() {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Success badge */}
        <View style={styles.successBadge}>
          <Text style={styles.successTick}>✓</Text>
        </View>

        <Text style={styles.heading}>Booking Confirmed!</Text>
        <Text style={styles.subheading}>
          Thank you, {confirmation.customerName.split(' ')[0]}. Your appointment
          is booked and has been added to our calendar. A confirmation email is
          on its way.
        </Text>

        {/* Reference card */}
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Booking Reference</Text>
          <Text style={styles.refValue}>{confirmation.reference}</Text>
          <Text style={styles.refNote}>Keep this for your records</Text>
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🔧</Text>
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>{confirmation.service}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {formatDisplayDate(confirmation.date)}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {formatTime(confirmation.time)}
              </Text>
            </View>
          </View>
        </View>

        {/* What happens next */}
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}>What happens next?</Text>
          {[
            'You\'ll receive a confirmation email shortly.',
            'Our engineer will call you 30 minutes before arrival.',
            'The appointment is now in our Google Calendar.',
            'To reschedule, call us on 0151 XXX XXXX.',
          ].map((item, i) => (
            <View key={i} style={styles.nextRow}>
              <Text style={styles.nextBullet}>›</Text>
              <Text style={styles.nextItem}>{item}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Share Booking Details"
          onPress={handleShare}
          variant="outline"
          style={styles.shareBtn}
        />

        <PrimaryButton
          label="Book Another Service"
          onPress={handleBookAnother}
          style={styles.anotherBtn}
        />

        <Text style={styles.contact}>
          Questions? Email{' '}
          <Text style={styles.contactLink}>info@smartechgas.co.uk</Text>
          {'\n'}or call{' '}
          <Text style={styles.contactLink}>0151 XXX XXXX</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.surfaceAlt},
  scroll: {
    padding: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: BRAND.success,
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 12,
    elevation: 8,
  },
  successTick: {
    fontSize: 38,
    color: BRAND.white,
    fontWeight: '900',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: BRAND.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refCard: {
    width: '100%',
    backgroundColor: BRAND.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  refLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  refValue: {
    fontSize: 28,
    fontWeight: '900',
    color: BRAND.white,
    letterSpacing: 2,
    marginBottom: 6,
  },
  refNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  detailIcon: {fontSize: 22},
  detailText: {flex: 1},
  detailLabel: {fontSize: 12, color: BRAND.textSecondary, marginBottom: 2},
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.textPrimary,
  },
  divider: {height: 1, backgroundColor: BRAND.border},
  nextCard: {
    width: '100%',
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 2,
  },
  nextTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.textPrimary,
    marginBottom: 12,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  nextBullet: {
    fontSize: 16,
    color: BRAND.primary,
    fontWeight: '700',
    lineHeight: 20,
  },
  nextItem: {
    fontSize: 13,
    color: BRAND.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  shareBtn: {width: '100%', marginBottom: 12},
  anotherBtn: {width: '100%', marginBottom: 20},
  contact: {
    fontSize: 13,
    color: BRAND.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  contactLink: {color: BRAND.primary, fontWeight: '700'},
});
