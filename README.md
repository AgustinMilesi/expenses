# ⚡ PocketWallet — Cyber-Lime Mobile Fintech & Digital Banking

A premier, high-fidelity mobile digital banking and smart expense management application built with **React Native**, **Expo (TypeScript)**, and **NativeWind (Tailwind CSS)**. Designed with a cutting-edge **Cyber Lime & Deep Charcoal** aesthetic, providing seamless navigation across payments, transfers, multi-currency accounts, and virtual payment cards.

<p align="left">
  <a href="https://expo.dev/artifacts/eas/4KlACYkfHxU14bITNmFSRYdkuBrz3MH7FVkXu-XggWs.apk"><img src="https://img.shields.io/badge/Download%20APK-Android%20Direct-C6F827?style=for-the-badge&logo=android&logoColor=black" alt="Download APK" /></a>
  <a href="https://expo.dev/accounts/agustinmilesi/projects/pocket-expenses"><img src="https://img.shields.io/badge/Expo%20Project-pocket--expenses-4630EB?style=for-the-badge&logo=expo" alt="Expo Project" /></a>
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-black?style=for-the-badge&logo=expo" alt="Expo Platform" />
  <img src="https://img.shields.io/badge/Expo-SDK%2058-000020?style=for-the-badge&logo=expo" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/React-19.3-20232a?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Theme-Cyber%20Lime-C6F827?style=for-the-badge" alt="Theme" />
</p>

---

## 🎨 Visual Identity & Architecture

PocketWallet faithfully matches a sleek, modern neo-fintech visual language:
- **Flagship Palette:** Vibrant Cyber Lime (`#C6F827`), Deep Charcoal Slate (`#0B0F07`), with crisp high-contrast cards and border glows.
- **Dynamic Ledger (Zero Sample Numbers):** All balances, transfer limits, and card states are calculated dynamically from real, live operations. When you send money, top up, or adjust limits, calculations are executed and persisted immediately to `AsyncStorage`.
- **Cross-Project Preferences Block:** A unified settings panel imported from the enterprise ecosystem allowing immediate real-time switching of **Display Mode**, **Accent Colors**, **Languages**, and **Currencies**.

---

## 📱 Core Screens & Experience

### 1. 🏠 Home / Dashboard
- **Profile Header:** Avatar with live handle (`@janvisd`), VIP Rewards trophy badge, and notification bell indicator.
- **Hero Balance Card (Neon Lime):** Features total account balance, weekly trend badge (`↑ 24% Last week`), curved pull tab, and 4 circular action triggers:
  - ↗️ **Send:** Opens the dedicated Send Money screen.
  - ↙️ **Request:** Prompts for receiving money or displaying the personal QR code.
  - 💳 **Payment:** Instant QR/Contactless payment scanner.
  - 📥 **Withdraw:** Quick cash-out to linked checking accounts.
- **Favourite Contacts:** Horizontal scroll of quick-send contacts (`+` Add Contact, Alina, Mark, Rachel, etc.).
- **Live Transaction Ledger:** Categorized transactional stream with timestamps, TrxIDs, and dynamic inflow/outflow color cues.

### 2. 💸 Send Money Screen
- **Interactive Source Card:** "Transfer from" neon card detailing masked account (`••••••5890`) and available balance.
- **Large Typographic Input:** Centered dynamic amount entry with active glowing caret.
- **Transfer Limits Track:** Visual slider gauge reflecting percentage utilization against the configurable transfer ceiling.
- **Quick-Send Pickers:** One-tap contact selection that automatically assigns recipients.
- **Custom Numeric Keypad:** Dedicated in-app 3x4 grid (`1-9`, `0`, `↵ Enter`, `⌫ Backspace`) with instant digit shifting.
- **Hold To Send:** High-contrast lime button that validates balance and completes transactions safely.

### 3. 💳 Cards Management
- **Virtual Credit/Debit Card:** Horizontal high-res card in cyber-lime gradient with VISA branding, cardholder name, expiry date (`12/30`), and formatted card number (`7820 5500 0835 3501`).
- **Freeze / Unfreeze Toggle:** Instant one-tap card lock for enhanced security.
- **2x4 Quick Actions Grid:**
  1. `Send Money` (Direct transfer)
  2. `Topup` (Deposit balance)
  3. `Statements` (Export PDF/ledger)
  4. `Bills Pay` (Utilities and recurring services)
  5. `Loans` (Pre-approved credit line)
  6. `Freeze Cards` (Pause activity)
  7. `Limit Request` (Adjust daily ceilings)
  8. `Deposits` (High-yield savings vault)
- **`+ Add Cards` Action:** Dynamically generate and link new physical or virtual cards.

### 4. 🧭 Floating Bottom Navigation Dock
- **Curved Elevated Dock:** Home, Cards, Transaction History, and Search.
- **Center Floating Action Button (FAB):** Glowing circular neon scanner button for QR codes and peer payments.

---

## ⚙️ The Preferences Block (Cross-Project Component)

Imported and adapted directly from our multi-project suite (`erp`, `saas`, `sap`, `contact-page`), the **PreferencesModal** provides complete personalization:

1. **Display Mode:** `Light` vs `Dark` mode.
2. **7 Accent Color Swatches:**
   - 🟩 `Cyber Lime` (Flagship `#C6F827`)
   - 🟢 `Emerald` (`#10B981`)
   - 🔵 `Electric Indigo` (`#6366F1`)
   - 🌹 `Rose Neon` (`#F43F5E`)
   - 🟡 `Amber Gold` (`#F59E0B`)
   - 🟦 `Cyber Cyan` (`#06B6D4`)
   - 🟣 `Clay Violet` (`#8B5CF6`)
3. **4 Languages:**
   - 🇪🇸 Español
   - 🇺🇸 English
   - 🇧🇷 Português
   - 🇨🇳 中文
4. **5 Global Currencies:**
   - 🇺🇸 `USD` ($)
   - 🇦🇷 `ARS` ($)
   - 🇪🇺 `EUR` (€)
   - 🇨🇳 `CNY` (¥)
   - 🇧🇷 `BRL` (R$)

---

## ⚖️ Legal & Regulatory Compliance

PocketWallet complies with global mobile application data privacy standards:
- [Terms of Service (TERMS_OF_SERVICE.md)](./TERMS_OF_SERVICE.md) — Comprehensive user agreements and usage terms.
- [Privacy Policy (PRIVACY_POLICY.md)](./PRIVACY_POLICY.md) — GDPR & CCPA offline-first compliance and data minimization.
- [Cookie & Storage Policy (COOKIES.md)](./COOKIES.md) — Transparent documentation of sandboxed `AsyncStorage` caching.
- [Legal Notice (LEGAL.md)](./LEGAL.md) — Regulatory status and banking disclaimer.
- **In-App Legal Viewer:** Directly accessible from `Preferences` -> `Legal & Privacy`.

---

## 🛠️ Tech Stack & Engineering Standards

- **Core Runtime:** React Native 0.88, React 19.3, Expo SDK 58 (TypeScript strict mode)
- **Styling:** NativeWind v4 (Tailwind CSS native compilation)
- **State & Storage:** React Hooks + `@react-native-async-storage/async-storage` (offline-first)
- **Vector Icons:** `@expo/vector-icons` (Ionicons)
- **Engineering Standards:** Clean modular architecture, minimal dependency footprint, offline-first data sovereignty, and high-fidelity native design system.

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js >= 22.0.0
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/AgustinMilesi/expenses.git
cd expenses

# Install dependencies
npm install

# Start development server
npm run start
```

### Typecheck & Quality Assurance
```bash
# Run TypeScript compilation check
npm run typecheck
```

---

## 📄 License & Author

- **Author & Maintainer:** Agustin Milesi ([agusmilesi2002@gmail.com](mailto:agusmilesi2002@gmail.com))
- **Repository:** [https://github.com/AgustinMilesi/expenses](https://github.com/AgustinMilesi/expenses)
- **License:** MIT License
