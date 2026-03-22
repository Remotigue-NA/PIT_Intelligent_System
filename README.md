# FreshCart Android Build Instructions

This project is set up with **Capacitor** to allow you to build an Android APK from the React web application.

## Prerequisites
- **Node.js** installed on your computer.
- **Android Studio** installed on your computer.
- **Java 17+** installed.

## How to Build the APK

1. **Download the project** from AI Studio (Export to ZIP or GitHub).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the web application**:
   ```bash
   npm run build
   ```
4. **Sync with Android**:
   ```bash
   npm run cap:sync
   ```
5. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```
6. **Generate APK**:
   - In Android Studio, wait for Gradle to finish syncing.
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once finished, a notification will appear with a "locate" link to your `.apk` file.

## Troubleshooting
- If you change the React code, remember to run `npm run build` and `npm run cap:sync` before building in Android Studio.
- Ensure your `JAVA_HOME` is correctly set to point to your Java installation.
