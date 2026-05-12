import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BRAND} from '../utils/constants';

const STEPS = ['Service', 'Date', 'Time', 'Details', 'Confirm'];

interface Props {
  currentStep: number; // 1-based
}

export default function StepIndicator({currentStep}: Props) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <React.Fragment key={label}>
            <View style={styles.stepWrap}>
              <View
                style={[
                  styles.circle,
                  done && styles.circleDone,
                  active && styles.circleActive,
                ]}>
                <Text
                  style={[
                    styles.circleText,
                    (done || active) && styles.circleTextActive,
                  ]}>
                  {done ? '✓' : step}
                </Text>
              </View>
              <Text
                style={[styles.label, active && styles.labelActive]}>
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.line, done && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  stepWrap: {alignItems: 'center'},
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BRAND.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.surface,
  },
  circleActive: {borderColor: BRAND.primary, backgroundColor: BRAND.primary},
  circleDone: {borderColor: BRAND.primary, backgroundColor: BRAND.primary},
  circleText: {fontSize: 11, fontWeight: '700', color: BRAND.textLight},
  circleTextActive: {color: BRAND.white},
  label: {fontSize: 9, color: BRAND.textLight, marginTop: 3},
  labelActive: {color: BRAND.primary, fontWeight: '700'},
  line: {
    flex: 1,
    height: 2,
    backgroundColor: BRAND.border,
    marginBottom: 14,
  },
  lineDone: {backgroundColor: BRAND.primary},
});
