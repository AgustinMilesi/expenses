# 📱 PocketExpenses — Mobile Cost & Subscription Tracker

A modern personal finance and mobile budget tracker built with **React Native**, **Expo (TypeScript)**, and **NativeWind (Tailwind CSS)**. Engineered to simplify personal cash flow: manage monthly fixed bills (utilities, rent, internet), recurring subscriptions, and leisure outings with real-time disposable income calculations.

<p align="left">
  <a href="https://expo.dev/artifacts/eas/4KlACYkfHxU14bITNmFSRYdkuBrz3MH7FVkXu-XggWs.apk"><img src="https://img.shields.io/badge/Download%20APK-Android%20Direct-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Download APK" /></a>
  <a href="https://expo.dev/accounts/agustinmilesi/projects/pocket-expenses"><img src="https://img.shields.io/badge/Expo%20Project-pocket--expenses-4630EB?style=for-the-badge&logo=expo" alt="Expo Project" /></a>
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-black?style=for-the-badge&logo=expo" alt="Expo Platform" />
  <img src="https://img.shields.io/badge/Expo-SDK%2058-000020?style=for-the-badge&logo=expo" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/React-19.3-20232a?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NativeWind-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="NativeWind" />
</p>

---

## 🎯 What is it for?

- **Fixed monthly bills**: Track non-negotiable household expenses (electricity, water, gas, fiber internet, apartment rent, mobile plan) with due day markers and payment toggles.
- **Subscription management**: Keep recurring services under control (Netflix, Spotify, gym memberships, cloud storage) to prevent forgotten subscription creep.
- **Leisure & outings control**: Log dining out, weekend drinks, concerts, and cinema tickets to enjoy social life without exceeding monthly limits.
- **Disposable balance gauge**: Dynamic budget card that subtracts committed expenses from net income to show your safe-to-spend allowance in real time.
- **Offline-first with instant demo data**: Powered by local storage (`AsyncStorage`) and preloaded with a realistic sample budget on launch so you can test it immediately without blank screens.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Budget Summary Card** | Real-time overview of monthly income, total committed funds, and safe-to-spend balance with health indicator. |
| **Category Distribution Bar** | Multi-segment stacked gauge visually breaking down Fixed Bills vs Subscriptions vs Leisure. |
| **Paid / Pending Checkbox** | Instant one-tap status toggle updating your total paid and pending balances on the fly. |
| **Multi-Currency Support** | Switch effortlessly between USD (`$`), ARS (`ARS $`), and EUR (`€`). |
| **Fast Modal Creation** | Add custom expenses with category pickers, due days (1-31), amount, and optional notes. |
| **One-Tap Demo Reset** | Quick reload button to restore the full sample dataset anytime. |

---

## 📲 Over-The-Air (OTA) Updates & Mobile Access

- **Instant testing via Expo Go:** Log in with your Expo account (`agustinmilesi`) inside the **Expo Go** app on iOS or Android. **PocketExpenses** will appear under your projects to launch immediately without scanning QR codes every time.
- **Automated Commit Syncing:** Every `git push` to `main` triggers a GitHub Action with EAS Update, pushing new code bundles over the air so your phone receives updates automatically.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 58 (TypeScript strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS compilation for native mobile runtimes)
- **State & Persistence**: React Hooks + `@react-native-async-storage/async-storage` (offline-first)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Animations**: `react-native-reanimated`
- **Delivery & OTA**: EAS Update + GitHub Actions CI/CD

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js** v20.9+
- **Expo Go** app installed on your physical device ([iOS App Store](https://apps.apple.com/app/expo-go/id982107779) / [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)) or an active iOS / Android simulator.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AgustinMilesi/expenses.git
cd expenses

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Scan the displayed QR code with your mobile camera or **Expo Go** to launch the application instantly on your phone.

---

### 🔗 Other Projects
- [💳 Retail Engine & POS](https://github.com/AgustinMilesi/retail) — Cloud point of sale with real-time stock control and cash shift audits.
- [📥 Customer Inbox SaaS](https://github.com/AgustinMilesi/inbox) — Multi-tenant customer inquiry inbox and embeddable forms.
- [🌐 OneCargo Logistics](https://github.com/AgustinMilesi/cargo) — International freight forwarding, customs clearance, and container tracking.
- [📬 Contact Portal](https://github.com/AgustinMilesi/contact) — Minimalist contact form and lead gateway with Zod validation.
