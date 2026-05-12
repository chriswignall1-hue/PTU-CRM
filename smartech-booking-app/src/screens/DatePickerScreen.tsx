import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import StepIndicator from '../components/StepIndicator';
import PrimaryButton from '../components/PrimaryButton';
import {getAvailableDates} from '../api/booklyApi';
import {BRAND} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'DatePicker'>;

type MarkedDates = {
  [date: string]: {
    disabled?: boolean;
    selected?: boolean;
    selectedColor?: string;
    marked?: boolean;
    dotColor?: string;
    textColor?: string;
  };
};

export default function DatePickerScreen({navigation, route}: Props) {
  const {service} = route.params;
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return {year: d.getFullYear(), month: d.getMonth() + 1};
  });

  const loadMonth = useCallback(
    async (year: number, month: number) => {
      setLoading(true);
      try {
        const dates = await getAvailableDates(service.booklyId, year, month);
        setAvailableDates(dates);

        const marks: MarkedDates = {};
        // Mark all days of month as disabled first
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          marks[key] = {disabled: true, textColor: BRAND.textLight};
        }
        // Then enable available ones
        dates.forEach(date => {
          marks[date] = {
            marked: true,
            dotColor: BRAND.primary,
            textColor: BRAND.textPrimary,
          };
        });
        setMarkedDates(marks);
      } catch {
        Alert.alert('Error', 'Unable to load available dates. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [service.booklyId],
  );

  useEffect(() => {
    loadMonth(currentMonth.year, currentMonth.month);
  }, [currentMonth, loadMonth]);

  function handleDayPress(day: DateData) {
    if (!availableDates.includes(day.dateString)) {return;}
    setSelectedDate(day.dateString);
    setMarkedDates(prev => {
      const updated = {...prev};
      // Remove previous selection highlight
      Object.keys(updated).forEach(k => {
        if (updated[k].selected) {
          updated[k] = {...updated[k], selected: false};
        }
      });
      updated[day.dateString] = {
        ...updated[day.dateString],
        selected: true,
        selectedColor: BRAND.primary,
      };
      return updated;
    });
  }

  function handleMonthChange(month: DateData) {
    setSelectedDate(null);
    setCurrentMonth({year: month.year, month: month.month});
  }

  function handleNext() {
    if (!selectedDate) {return;}
    navigation.navigate('TimeSlot', {service, date: selectedDate});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepIndicator currentStep={2} />
      <View style={styles.header}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.subtitle}>
          Highlighted dates have availability — tap to select.
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={BRAND.primary} />
          <Text style={styles.loadingText}>Checking availability...</Text>
        </View>
      )}

      <Calendar
        current={today}
        minDate={today}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        theme={{
          backgroundColor: BRAND.surface,
          calendarBackground: BRAND.surface,
          selectedDayBackgroundColor: BRAND.primary,
          selectedDayTextColor: BRAND.white,
          todayTextColor: BRAND.primary,
          arrowColor: BRAND.primary,
          dotColor: BRAND.primary,
          textDayFontWeight: '600',
          textMonthFontWeight: '800',
          textDayHeaderFontWeight: '600',
        }}
        style={styles.calendar}
      />

      <View style={styles.footer}>
        {selectedDate && (
          <Text style={styles.selectedLabel}>
            Selected:{' '}
            <Text style={styles.selectedDate}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </Text>
        )}
        <PrimaryButton
          label="Choose a Time →"
          onPress={handleNext}
          disabled={!selectedDate}
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.surfaceAlt},
  header: {
    backgroundColor: BRAND.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '700',
    color: BRAND.primary,
    marginBottom: 4,
  },
  subtitle: {fontSize: 13, color: BRAND.textSecondary},
  loadingOverlay: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: BRAND.surface,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: BRAND.textSecondary,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  footer: {
    backgroundColor: BRAND.surface,
    padding: 20,
    marginTop: 'auto',
  },
  selectedLabel: {
    fontSize: 13,
    color: BRAND.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  selectedDate: {
    fontWeight: '700',
    color: BRAND.textPrimary,
  },
  btn: {width: '100%'},
});
