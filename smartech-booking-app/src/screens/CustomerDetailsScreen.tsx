import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, CustomerDetails} from '../types';
import PrimaryButton from '../components/PrimaryButton';
import StepIndicator from '../components/StepIndicator';
import {BRAND} from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerDetails'>;

interface FieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
}

function Field({label, required, error, ...rest}: FieldProps) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>
        {label}
        {required && <Text style={fieldStyles.required}> *</Text>}
      </Text>
      <TextInput
        style={[fieldStyles.input, error ? fieldStyles.inputError : undefined]}
        placeholderTextColor={BRAND.textLight}
        {...rest}
      />
      {error ? <Text style={fieldStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: {marginBottom: 16},
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND.textSecondary,
    marginBottom: 6,
  },
  required: {color: BRAND.error},
  input: {
    backgroundColor: BRAND.surface,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: BRAND.textPrimary,
  },
  inputError: {borderColor: BRAND.error},
  errorText: {fontSize: 12, color: BRAND.error, marginTop: 4},
});

export default function CustomerDetailsScreen({navigation, route}: Props) {
  const {service, date, timeSlot} = route.params;

  const [form, setForm] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postcode: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  function update(field: keyof CustomerDetails, value: string) {
    setForm(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<CustomerDetails> = {};
    if (!form.firstName.trim()) {newErrors.firstName = 'First name is required';}
    if (!form.lastName.trim()) {newErrors.lastName = 'Last name is required';}
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+\-()]{10,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }
    if (!form.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    if (!form.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    } else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(form.postcode)) {
      newErrors.postcode = 'Please enter a valid UK postcode';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate()) {return;}
    navigation.navigate('BookingSummary', {service, date, timeSlot, customer: form});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StepIndicator currentStep={4} />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <Text style={styles.sectionTitle}>Contact Details</Text>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Field
                label="First Name"
                required
                placeholder="John"
                value={form.firstName}
                onChangeText={v => update('firstName', v)}
                autoCapitalize="words"
                error={errors.firstName}
                returnKeyType="next"
              />
            </View>
            <View style={styles.halfField}>
              <Field
                label="Last Name"
                required
                placeholder="Smith"
                value={form.lastName}
                onChangeText={v => update('lastName', v)}
                autoCapitalize="words"
                error={errors.lastName}
                returnKeyType="next"
              />
            </View>
          </View>

          <Field
            label="Email Address"
            required
            placeholder="john@example.com"
            value={form.email}
            onChangeText={v => update('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            returnKeyType="next"
          />

          <Field
            label="Phone Number"
            required
            placeholder="07xxx xxxxxx"
            value={form.phone}
            onChangeText={v => update('phone', v)}
            keyboardType="phone-pad"
            error={errors.phone}
            returnKeyType="next"
          />

          <Text style={styles.sectionTitle}>Property Address</Text>

          <Field
            label="Address Line 1"
            required
            placeholder="123 Example Street"
            value={form.addressLine1}
            onChangeText={v => update('addressLine1', v)}
            autoCapitalize="words"
            error={errors.addressLine1}
            returnKeyType="next"
          />

          <Field
            label="Address Line 2"
            placeholder="Apartment, flat, etc. (optional)"
            value={form.addressLine2}
            onChangeText={v => update('addressLine2', v)}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Field
            label="Postcode"
            required
            placeholder="L1 1AA"
            value={form.postcode}
            onChangeText={v => update('postcode', v.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            error={errors.postcode}
            returnKeyType="next"
          />

          <Text style={styles.sectionTitle}>Additional Information</Text>

          <Field
            label="Notes for the engineer"
            placeholder="e.g. access instructions, boiler location, fault description..."
            value={form.notes}
            onChangeText={v => update('notes', v)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{minHeight: 90}}
          />

          <Text style={styles.privacyNote}>
            🔒 Your details are used only to process your booking and will be
            stored securely in line with our privacy policy.
          </Text>

          <PrimaryButton
            label="Review Booking →"
            onPress={handleNext}
            style={styles.btn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: BRAND.surfaceAlt},
  kav: {flex: 1},
  scroll: {padding: 20, paddingBottom: 40},
  row: {flexDirection: 'row', gap: 12},
  halfField: {flex: 1},
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
    marginTop: 8,
  },
  privacyNote: {
    fontSize: 12,
    color: BRAND.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    marginTop: 4,
  },
  btn: {width: '100%'},
});
