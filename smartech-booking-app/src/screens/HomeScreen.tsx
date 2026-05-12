import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {BRAND} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const {height} = Dimensions.get('window');

export default function HomeScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND.primary} />

      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>SG</Text>
          </View>
          <View>
            <Text style={styles.logoTitle}>Smartech Gas</Text>
            <Text style={styles.logoSub}>Gas Safe Registered Engineers</Text>
          </View>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🔥</Text>
        <Text style={styles.heroTitle}>Book a Gas Engineer</Text>
        <Text style={styles.heroSubtitle}>
          Fast, reliable, Gas Safe registered engineers covering Liverpool and
          surrounding areas. Appointments available 7 days.
        </Text>
      </View>

      {/* Service highlights */}
      <View style={styles.highlights}>
        {[
          {icon: '✅', text: 'Gas Safe Registered'},
          {icon: '📅', text: 'Same-week appointments'},
          {icon: '⭐', text: '5-star rated service'},
          {icon: '🗓️', text: 'Google Calendar confirmations'},
        ].map(item => (
          <View key={item.text} style={styles.highlight}>
            <Text style={styles.highlightIcon}>{item.icon}</Text>
            <Text style={styles.highlightText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('ServiceSelection')}
          activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>Book Now</Text>
        </TouchableOpacity>

        <Text style={styles.ctaSmall}>
          Bookings sync instantly with our Google Calendar
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📞 Need help? Call us on{' '}
          <Text style={styles.footerLink}>0151 XXX XXXX</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.primary},
  header: {
    backgroundColor: BRAND.primary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  logoRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {fontSize: 16, fontWeight: '900', color: BRAND.white},
  logoTitle: {fontSize: 18, fontWeight: '800', color: BRAND.white},
  logoSub: {fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1},
  hero: {
    backgroundColor: BRAND.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  heroEmoji: {fontSize: 52, marginBottom: 12},
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: BRAND.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlights: {
    backgroundColor: BRAND.surface,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  highlight: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BRAND.surfaceAlt,
    borderRadius: 10,
    padding: 10,
  },
  highlightIcon: {fontSize: 18},
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND.textPrimary,
    flex: 1,
  },
  ctaWrap: {
    flex: 1,
    backgroundColor: BRAND.surface,
    paddingHorizontal: 24,
    paddingTop: 8,
    justifyContent: 'flex-start',
  },
  ctaBtn: {
    backgroundColor: BRAND.primary,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND.primary,
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND.white,
    letterSpacing: 0.5,
  },
  ctaSmall: {
    fontSize: 12,
    color: BRAND.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    backgroundColor: BRAND.surface,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {fontSize: 13, color: BRAND.textSecondary},
  footerLink: {color: BRAND.primary, fontWeight: '700'},
});
