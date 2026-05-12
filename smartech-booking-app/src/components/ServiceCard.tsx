import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {Service} from '../types';
import {BRAND, SERVICE_ICONS} from '../utils/constants';

interface Props {
  service: Service;
  onPress: (service: Service) => void;
}

export default function ServiceCard({service, onPress}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(service)}
      activeOpacity={0.75}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{SERVICE_ICONS[service.id]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{service.price}</Text>
          <Text style={styles.duration}>{service.duration} min</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFF0EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {fontSize: 26},
  content: {flex: 1},
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: BRAND.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {flexDirection: 'row', alignItems: 'center', gap: 12},
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND.primary,
  },
  duration: {
    fontSize: 12,
    color: BRAND.textLight,
  },
  arrow: {
    fontSize: 24,
    color: BRAND.textLight,
    marginLeft: 8,
  },
});
