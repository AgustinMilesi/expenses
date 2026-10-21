# Cookie and Local Storage Policy

**Last Updated:** October 20, 2026  
**Effective Date:** October 20, 2026

This Cookie and Local Storage Policy explains how **VOUT** utilizes local device storage technologies, offline caches, and preferences storage instead of traditional web tracking cookies.

---

## 1. What Are Cookies vs. Mobile Local Storage?

- **Traditional Web Cookies:** Small text files sent between a web browser and an external server to track sessions, authenticate web users, and serve targeted digital advertisements across websites.
- **Native Mobile Storage (`AsyncStorage`):** An encrypted key-value storage system embedded within iOS and Android sandbox environments. It operates completely offline, never transmits data over the Internet, and cannot be accessed by other applications installed on your phone.

## 2. Does VOUT Use Tracking Cookies?

**NO.** VOUT does not implement third-party tracking cookies, advertising identifiers (IDFA or GAID), or cross-site tracking beacons. 

## 3. How We Use Local Storage (AsyncStorage)

VOUT uses persistent device storage strictly for essential, user-facing functionalities:

| Storage Key | Purpose | Expiration |
| :--- | :--- | :--- |
| `@wallet_preferences_v3` | Remembers your chosen theme (Dark/Light), active accent swatch (Lime, Emerald, Indigo, etc.), language, and currency | Persistent until cleared |
| `@wallet_user_data_v3` | Stores your dynamic balance, transfer limits, and account handle locally | Persistent until cleared |
| `@wallet_transactions_v3` | Stores your live transactions list, transfer amounts, and timestamps | Persistent until cleared |
| `@wallet_contacts_v3` | Caches your quick-send recipient contacts | Persistent until cleared |
| `@wallet_cards_v3` | Saves your virtual credit/debit cards and card freeze statuses | Persistent until cleared |

## 4. How to Manage or Delete Local Storage

You maintain complete control over this stored data at all times:
1. **Via the App:** You can clear transaction history in the History screen or reset balances via the preferences menu.
2. **Via Android Settings:** Navigate to `Settings` -> `Apps` -> `VOUT` -> `Storage & Cache` -> `Clear Storage`.
3. **Via iOS Settings:** Uninstalling the app permanently purges all sandboxed data from your iPhone or iPad.

## 5. Inquiries

For questions regarding local caching or device storage policies:
- **Developer:** VOUT Cloud Organization
- **Email:** legal@vout.network
- **Repository:** [https://github.com/AgustinMilesi/expenses](https://github.com/AgustinMilesi/expenses)
