# Privacy Policy

**Last Updated:** October 20, 2026  
**Effective Date:** October 20, 2026

At **PocketWallet**, safeguarding your privacy and ensuring transparency regarding how financial and personal data is handled is our highest priority. This Privacy Policy details our offline-first architecture, zero-tracking commitment, and your rights under global privacy regulations, including the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).

---

## 1. Core Principle: Privacy by Design

PocketWallet is fundamentally engineered as an **offline-first, zero-telemetry client application**:
- **No Remote Database:** We do not host your transactions, banking figures, budgets, or balances on external centralized cloud servers.
- **No Third-Party Brokers:** We do not monetize, rent, disclose, or sell your financial habits or personal records to data brokers, advertising networks, or analytics aggregators.
- **Local Sandbox Storage:** 100% of your transactional data resides directly within your mobile operating system's private sandbox via React Native `AsyncStorage`.

## 2. Information Handled Locally

The application stores the following categories of data strictly on your local device:
1. **User Profile Settings:**
   - Display name and handle (e.g., `Janvis David`, `@janvisd`).
   - Interface preferences (Mode: `Dark` or `Light`; Accent Palette: `Lime`, `Emerald`, `Indigo`, `Rose`, `Amber`, `Cyan`, `Violet`).
   - Active language (`Spanish`, `English`, `Portuguese`, `Chinese`).
   - Active currency unit (`USD`, `ARS`, `EUR`, `CNY`, `BRL`).
2. **Financial Records:**
   - Account balances, daily limits, and dynamic calculations.
   - Transaction ledger (amounts, timestamps, categories, and TrxIDs).
   - Saved favourite contacts (contact name, masked account numbers, initials).
   - Virtual cards (cardholder label, expiry date, brand, and masked numbers).

## 3. Third-Party Integrations & Network Permissions

PocketWallet runs independently without requiring ongoing network connectivity:
- The network permission in the manifest is used strictly for downloading optional Over-The-Air (OTA) application updates via Expo Updates if enabled by the user.
- No analytics trackers (such as Google Firebase, Facebook Pixel, or Mixpanel) are bundled into the application binary.

## 4. Your Rights Under GDPR, CCPA, and Global Privacy Laws

Regardless of your geographic location, you retain complete sovereignty over your data:
- **Right to Access & Portability:** You can review all records at any time directly through the app interface.
- **Right to Rectification:** You can edit any transaction, contact, card, or currency rate instantaneously.
- **Right to Erasure ("Right to Be Forgotten"):** You can wipe all stored data at any time by clearing the history in the Settings/Preferences modal or clearing application storage in your device OS settings.

## 5. Security & Device Protection

While data is stored in the operating system's sandboxed storage:
- We advise users to protect their physical devices using biometric locks (Fingerprint, Face ID) or device passcodes.
- Operating system-level full-disk encryption (such as Apple iOS Data Protection or Android File-Based Encryption) naturally protects the application's local files.

## 6. Children's Privacy

PocketWallet is not directed to individuals under the age of 13. Because no data is collected externally, we never knowingly harvest personal identifiers from minors.

## 7. Updates to This Privacy Policy

We may periodically revise this Privacy Policy to reflect software improvements or legal standards. Revisions will be published directly within the application and in this repository.

## 8. Privacy Contact

If you have questions or concerns regarding privacy in PocketWallet:
- **Data Controller:** Agustin Milesi
- **Email:** agusmilesi2002@gmail.com
- **GitHub:** [https://github.com/AgustinMilesi/expenses](https://github.com/AgustinMilesi/expenses)
