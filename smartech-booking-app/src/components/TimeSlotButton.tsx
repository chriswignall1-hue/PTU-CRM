import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {BooklySlot} from '../types';
import {BRAND} from '../utils/constants';

interface Props {
  slot: BooklySlot;
  selected: boolean;
  onPress: (slot: BooklySlot) => void;
}

function formatTime(datetime: string): string {
  // datetime format: "YYYY-MM-DD HH:MM:SS"
  const timePart = datetime.split(' ')[1] ?? datetime;
  const [h, m] = timePart.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m}${ampm}`;
}

export default function TimeSlotButton({slot, selected, onPress}: Props) {
  return (
    <TouchableOpacity
      style={[styles.slot, selected && styles.slotSelected]}
      onPress={() => onPress(slot)}
      activeOpacity={0.75}>
      <Text style={[styles.time, selected && styles.timeSelected]}>
        {formatTime(slot.start)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '30%',
    marginBottom: 10,
    marginHorizontal: '1.5%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    backgroundColor: BRAND.surface,
    alignItems: 'center',
  },
  slotSelected: {
    borderColor: BRAND.primary,
    backgroundColor: '#FFF0EB',
  },
  time: {
    fontSize: 15,
    fontWeight: '600',
    color: BRAND.textPrimary,
  },
  timeSelected: {
    color: BRAND.primary,
  },
});
