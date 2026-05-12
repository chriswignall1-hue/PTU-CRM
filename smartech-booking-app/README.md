# Smartech Gas Booking App

React Native mobile app for booking Smartech Gas services. Communicates with the
same Bookly database as www.smartechgas.co.uk and inherits the existing Google
Calendar sync automatically.

## Booking Flow

```
Home → Select Service → Choose Date → Choose Time → Your Details → Review → Confirmed
```

All 7 screens are complete with validation, loading states, and error handling.

---

## Quick Start (Development)

### Prerequisites

- Node.js 18+
- [React Native environment setup](https://reactnative.dev/docs/environment-setup)
  - macOS + Xcode 14+ for iOS
  - Android Studio + JDK 17 for Android

### Install & Run

```bash
cd smartech-booking-app
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

The app runs in **mock mode** by default — no live API needed during development.

---

## Connecting to Your Live Bookly Database

### Step 1 — Purchase the Bookly REST API addons

Buy both from CodeCanyon and install on your WordPress site:

| Addon | Purpose | ~Cost |
|-------|---------|-------|
| [Bookly Read Rest API](https://codecanyon.net/item/wpo-bookly-api/22546449) | Read services, slots, appointments | ~$39 |
| [Bookly CRED Rest API Operations](https://wpintegrate.com/product/bookly-cred-rest-api-operations/) | Create / update bookings | ~$39 |

### Step 2 — Create a WordPress Application Password

1. WP Admin → Users → Your Profile → Application Passwords
2. Add a new password named "Smartech Booking App"
3. Copy the generated password (shown only once)

### Step 3 — Update `src/utils/constants.ts`

```ts
// Switch off mock mode
export const USE_MOCK_API = false;

// Your WordPress credentials
// In production, store these in a secure env file, not hardcoded
```

### Step 4 — Add the Authorization header in `src/api/booklyApi.ts`

Uncomment the Authorization line in both axios instances:

```ts
'Authorization': 'Basic ' + btoa('your_wp_username:your_application_password'),
```

### Step 5 — Update service IDs

In `src/utils/constants.ts`, update each `booklyId` to match the actual IDs
in WP Admin → Bookly → Services.

### Step 6 — Update staff ID

Set `DEFAULT_STAFF_ID` to the ID found in WP Admin → Bookly → Staff Members.

---

## Google Calendar

No extra work needed. Bookly's Google Calendar sync runs on the WordPress side.
Every booking created via the app goes through the same Bookly database, so it
appears on the calendar automatically — exactly as if booked from the website.

---

## App Store Submission

### Apple App Store

1. **Apple Developer account**: enrol at developer.apple.com (£79/year)
2. Set Bundle ID in Xcode: `uk.co.smartechgas.booking`
3. Add app icons to `ios/SmartechGasBooking/Images.xcassets/AppIcon.appiconset`
4. Archive in Xcode → Distribute App → App Store Connect
5. Fill in App Store Connect listing (description, screenshots, category: Lifestyle/Utilities)

### Google Play Store

1. **Google Play Console account**: one-time fee of £20 at play.google.com/console
2. Update `android/app/build.gradle`: set `applicationId "uk.co.smartechgas.booking"`
3. Generate a signed release APK/AAB: `npx react-native build-android --mode=release`
4. Upload AAB to Play Console → Create new release → Production

---

## Project Structure

```
src/
├── api/
│   └── booklyApi.ts       # Bookly REST API + mock data layer
├── components/
│   ├── PrimaryButton.tsx
│   ├── ServiceCard.tsx
│   ├── StepIndicator.tsx
│   └── TimeSlotButton.tsx
├── navigation/
│   └── AppNavigator.tsx   # React Navigation stack
├── screens/
│   ├── HomeScreen.tsx
│   ├── ServiceSelectionScreen.tsx
│   ├── DatePickerScreen.tsx
│   ├── TimeSlotScreen.tsx
│   ├── CustomerDetailsScreen.tsx
│   ├── BookingSummaryScreen.tsx
│   └── ConfirmationScreen.tsx
├── types/
│   └── index.ts           # All TypeScript types
└── utils/
    └── constants.ts       # Brand colours, API URLs, service definitions
```

---

## Customisation Checklist

- [ ] Replace phone number `0151 XXX XXXX` with your real number (HomeScreen, ConfirmationScreen)
- [ ] Replace `info@smartechgas.co.uk` placeholder if email differs (ConfirmationScreen)
- [ ] Update service prices in `constants.ts` to match your current rates
- [ ] Add your app icon (1024×1024px PNG) and splash screen images
- [ ] Set `USE_MOCK_API = false` and add real credentials before going live
- [ ] Update `booklyId` values in `constants.ts` to match your Bookly service IDs
