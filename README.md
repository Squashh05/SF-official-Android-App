# SF25 Mobile App

This is a React Native mobile application built with [Expo](https://expo.dev).

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- For iOS development: macOS and Xcode
- For Android development: Android Studio and Android SDK
- For local builds (macOS/Linux only): Docker

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on different platforms:
   - Press `a` to open in Android emulator
   - Press `i` to open in iOS simulator
   - Scan QR code with Expo Go app on your physical device
   - Press `w` to open in web browser

## Development Client

To use the development client instead of Expo Go:

1. Configure your app.json/app.config.js with development client settings
2. Build the development client:
   ```bash
   eas build --profile development --platform android
   # or for iOS
   eas build --profile development --platform ios
   ```
3. Install the development client on your device
4. Start the development server with:
   ```bash
   npx expo start --dev-client
   ```

## Building for Production

### Android APK (Development/Testing)

1. Configure your eas.json with a build profile:
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

2. Build the APK:
   ```bash
   eas build --profile preview --platform android
   ```

### Android AAB (Play Store)

1. Configure your eas.json with a production profile:
   ```json
   {
     "build": {
       "production": {
         "channel": "master",
			"autoIncrement": true
       }
     }
   }
   ```

2. Build the AAB:
   ```bash
   eas build --p android
   ```

### iOS IPA (App Store)

1. Configure your eas.json with a production profile
2. Build the IPA:
   ```bash
   eas build -p ios
   ```

## Local Builds (macOS/Linux only)

To build locally instead of using EAS Build service:

For detailed instructions on setting up local builds, please visit the [Expo Local Builds Documentation](https://docs.expo.dev/build-reference/local-builds/).

Run local build:
   ```bash
   eas build --profile development --platform android --local
   # or for iOS
   eas build --profile development --platform ios --local
   eas build -p android --local
   # or for iOS
   eas build -p ios --local
   ```

## Troubleshooting

- If you encounter build issues, try clearing the cache:
  ```bash
  expo start -c
  ```

- For local build issues, ensure Docker is running and has sufficient resources

- If you get EAS build errors, check your eas.json configuration and credentials

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
