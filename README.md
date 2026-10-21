# ⚡ VOLT — Cyber-Lime Expenses, Subscriptions & Micro-spending Tracker

A high-performance personal expense and recurring commitments manager built with **React Native**, **Expo (TypeScript)**, and **NativeWind (Tailwind CSS)**. Designed with a striking **Cyber Lime & Deep Charcoal** aesthetic, engineered specifically for tracking **daily expenses**, **monthly subscriptions**, **fixed utility bills**, and **micro-expenses** (coffee, snacks, transport) with instant numerical keypad entry and disposable balance calculations.

<p align="left">
  <a href="https://expo.dev/accounts/agustinmilesi/projects/pocket-expenses/builds/e96134f5-2f11-4b67-9a96-d65a1b371b51"><img src="https://img.shields.io/badge/Download%20APK-VOLT%20v1.0.0-C6F827?style=for-the-badge&logo=android&logoColor=black" alt="Download VOLT APK" /></a>
  <a href="https://expo.dev/accounts/agustinmilesi/projects/pocket-expenses"><img src="https://img.shields.io/badge/Expo%20Project-pocket--expenses-4630EB?style=for-the-badge&logo=expo" alt="Expo Project" /></a>
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-black?style=for-the-badge&logo=expo" alt="Expo Platform" />
  <img src="https://img.shields.io/badge/Expo-SDK%2058-000020?style=for-the-badge&logo=expo" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/React-19.3-20232a?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Theme-Cyber%20Lime-C6F827?style=for-the-badge" alt="Theme" />
</p>

---

## 🎯 Purpose & Core Capabilities

- **Disposable Balance ("Safe to Spend"):** Real-time gauge calculating `Monthly Net Income - Committed Expenses` to show exactly how much uncommitted cash you have left.
- **Subscriptions & Recurring Bills:** Dedicated tracker for streaming services (Netflix, Spotify), memberships (Gym, Cloud Storage), and fixed household bills (rent, electricity, fiber internet) with day-of-month due dates and one-tap payment toggles.
- **Micro-spending Fast Track:** Ultrafast logging for small impulse and daily transactions (specialty coffee, snacks, kiosco, short cab rides) using a custom on-screen 3x4 numeric keypad.
- **Zero Dummy Numbers:** All ledger records, percentages, and balances are computed mathematically from stored data in `AsyncStorage`.

---

## 🎨 Visual Identity & Screen Architecture

VOLT pairs high-contrast neo-fintech aesthetics with disciplined budget tracking:

### 1. 🏠 Home / Dashboard
- **Profile & Quick Settings:** User header with live savings streak indicator, alerts bell, and interface preferences trigger.
- **Hero Disposable Balance Card (Cyber Lime `#C6F827`):**
  - Large display of current disposable balance.
  - Health indicator pill (`Safe to Spend %` / `EQUILIBRADO`).
  - Monthly net income vs. committed expenses breakdown.
  - 4 Integrated Action Triggers:
    - ➕ **+ Gasto:** Fast keypad expense logger.
    - 🔁 **Subs:** View and manage subscriptions.
    - 🏠 **Fijos:** Filter fixed household bills.
    - 💼 **Ingreso:** Edit monthly income and savings target.
- **Upcoming Subscriptions Carousel:** Horizontal cards displaying imminent bills (due day, amount, and instant paid/pending checkmark).
- **Recent Expenses & Micro-spending Stream:** Live feed categorized into Microgastos, Subscriptions, Fixed Bills, and Leisure with status toggles.

### 2. ⚡ Quick Expense Entry Screen
- **Budget Impact Card:** Real-time preview of your disposable balance before and projected balance *after* the expense.
- **Centered Typographic Input:** Big digit display with glowing lime cursor.
- **Budget Utilization Slider:** Dynamic gauge showing what percentage of your monthly income this expense represents.
- **Quick-Pick Presets:** One-tap chips for frequent micro-expenses (☕ Coffee, 🚕 Taxi, 🍿 Snacks, 🍔 Lunch, 🛒 Groceries).
- **Built-in 3x4 Numeric Keypad:** Fast physical-style entry (`1-9`, `0`, `↵ Enter`, `⌫ Backspace`).
- **Hold To Save:** Tactile confirmation button that validates and saves expenses.

### 3. 🔁 Subscriptions & Fixed Commitments
- **Recurring Commitments Card:** Cyber-lime physical card summary showing total monthly recurring outflow and pending count.
- **2x4 Quick Action Grid:**
  - `+ Gasto` • `+ Sub` • `Pagar Todo` • `Ingreso`
- **Active Services Ledger:** List of all recurring contracts with monthly cost, day of month, and one-tap payment toggle.
- **`+ Agregar Suscripción`:** Add custom streaming services or bills.

### 4. 🧭 Floating Bottom Navigation Dock
- **Elevated Curved Dock:** Overview, Subscriptions, History, and Search.
- **Center Floating Action Button (+):** Glowing neon lime button launching the rapid micro-expense keypad anytime.

---

## ⚙️ The Preferences Block (Cross-Project Component)

Imported and unified with the enterprise suite (`erp`, `saas`, `sap`, `contact-page`):

1. **Display Mode:** `Light` vs `Dark` mode.
2. **7 Accent Palettes:**
   - 🟩 `Cyber Lime` (Flagship `#C6F827`)
   - 🟢 `Emerald` (`#10B981`)
   - 🔵 `Electric Indigo` (`#6366F1`)
   - 🌹 `Rose Neon` (`#F43F5E`)
   - 🟡 `Amber Gold` (`#F59E0B`)
   - 🟦 `Cyber Cyan` (`#06B6D4`)
   - 🟣 `Clay Violet` (`#8B5CF6`)
3. **4 Languages:**
   - 🇪🇸 Español • 🇺🇸 English • 🇧🇷 Português • 🇨🇳 中文
4. **5 Global Currencies:**
   - 🇺🇸 `USD` ($) • 🇦🇷 `ARS` ($) • 🇪🇺 `EUR` (€) • 🇨🇳 `CNY` (¥) • 🇧🇷 `BRL` (R$)
5. **📳 Shake to Update & In-App OTA Updater:**
   - **Hardware Accelerometer Detection:** Shaking the physical device anywhere triggers an instant live update check with tactile haptic vibration (`Vibration.vibrate`).
   - **Direct Check Button:** Available in the Home header and Preferences drawer (`🔄 Buscar y aplicar actualización`).
   - **Live Modal State:** Displays real-time downloading progress, channel (`production`), and auto-reloads when new bundles are fetched.

---

## ⚖️ Legal & Regulatory Compliance

VOLT adheres to global consumer privacy and data sovereignty standards:
- [Terms of Service (TERMS_OF_SERVICE.md)](./TERMS_OF_SERVICE.md)
- [Privacy Policy (PRIVACY_POLICY.md)](./PRIVACY_POLICY.md)
- [Cookie & Storage Policy (COOKIES.md)](./COOKIES.md)
- [Legal Notice (LEGAL.md)](./LEGAL.md)
- **In-App Legal Viewer:** Accessible directly in `Preferences` -> `Legal & Privacy`.

---

## 🛠️ Tech Stack & Engineering Standards

- **Core Runtime:** React Native 0.88, React 19.3, Expo SDK 58 (TypeScript strict mode)
- **Styling:** NativeWind v4 (Tailwind CSS native compilation)
- **Storage:** Offline-first `@react-native-async-storage/async-storage`
- **Icons:** `@expo/vector-icons` (Ionicons)
- **OTA Updates:** EAS Update (`production` channel)

---

## 🚀 Quickstart & Development

```bash
# Clone the repository
git clone https://github.com/AgustinMilesi/expenses.git
cd expenses

# Install dependencies
npm install

# Start development server
npm run start

# Run TypeScript compilation check
npm run typecheck
```

---

## 📄 License & Author

- **Author & Maintainer:** Agustin Milesi ([agusmilesi2002@gmail.com](mailto:agusmilesi2002@gmail.com))
- **Repository:** [https://github.com/AgustinMilesi/expenses](https://github.com/AgustinMilesi/expenses)
- **License:** MIT License
