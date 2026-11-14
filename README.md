# Matty Countdown — PWA + Android APK

A neon-futuristic countdown timer built with HTML, CSS and JavaScript. Includes PWA install support and a Capacitor Android wrapper.

## Included
- Editable minutes and seconds
- Presets: 1, 5, 10, 25 and 60 minutes
- Start, pause/resume and reset
- Neon progress ring and responsive layout
- Completion sound and vibration (device/browser dependent)
- Full-screen mode
- PWA manifest, service worker and app icons
- Capacitor Android project configuration

## 1. Requirements
- Node.js 20 LTS (or a compatible current LTS)
- npm
- Git account (optional, for GitHub deployment)
- Android Studio + Android SDK for APK generation
- Java 17 for Android builds

## 2. Run locally
Open a terminal in this project folder:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. For a production build:

```bash
npm run build
npm run preview
```

## 3. Deploy the PWA to Vercel
1. Create a GitHub repository named `matty-countdown`.
2. Upload the contents of this folder to the repository (do not upload `node_modules`).
3. Sign in to Vercel and choose **Add New → Project**.
4. Import the GitHub repository.
5. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
6. Select **Deploy**.
7. Open the generated HTTPS URL on your phone.

The app requires HTTPS (or localhost) for service workers and installability. Vercel supplies HTTPS automatically.

### Install on iPhone
1. Open the deployed HTTPS URL in Safari.
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Confirm the app name and tap Add.

### Install on Android
1. Open the deployed HTTPS URL in Chrome.
2. Tap the browser's Install app prompt or menu → **Install app** / **Add to Home screen**.

## 4. Build Android APK with Capacitor
Run from the project folder:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to finish.
2. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. When the build completes, click **locate** in the notification.
4. Debug APK is normally at `android/app/build/outputs/apk/debug/app-debug.apk`.

For a distributable signed APK:
1. Android Studio → **Build → Generate Signed Bundle / APK**.
2. Select **APK**.
3. Create or select a keystore. Keep the keystore and passwords private and backed up.
4. Choose the `release` build variant and finish.
5. The signed APK is normally in `android/app/build/outputs/apk/release/`.

Do not share a debug APK as a public production release. For Google Play, generate an Android App Bundle (AAB) and complete Play Console requirements.

## 5. Update the app
After editing source files:

```bash
npm run build
npx cap sync android
```

For the PWA, deploy the new build. If users still see an older cached version, increment the cache name in `public/sw.js` (for example `matty-countdown-v2`) and redeploy.

## Notes / limitations
- This project is prepared for deployment; it has **not** been published to a hosting account or compiled into an APK from this environment.
- Browser audio may require a user interaction first. Alarm playback and vibration depend on device/browser permissions and power settings.
- Screen Wake Lock is best-effort and may not be supported by every browser.
- The Google Fonts import is optional; if offline typography is required, replace it with bundled font files or a system font stack.
- Test on real iOS and Android devices before public release.
