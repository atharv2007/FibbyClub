# Fibby App - Complete Database Structure & Sample Data

**Database Name:** `test_database`  
**Total Collections:** 8  
**Generated:** December 13, 2025

---

## Collections Overview

| Collection | Purpose | Document Count | Key Fields |
|-----------|---------|----------------|------------|
| `users` | User profiles | 1+ | name, email, created_at |
| `bank_accounts` | Bank account details | 1 per user | bank_name, account_number, balance, ifsc |
| `transactions` | All spending/income transactions | ~300 per user | amount, category, merchant, date, type |
| `investment_holdings` | Stock/Equity holdings | 6 per user | tradingsymbol, quantity, average_price, last_price, pnl |
| `mutual_funds` | Mutual Fund investments | 4 per user | fund, folio, quantity, is_sip, sip_amount |
| `other_investments` | FD, Crypto, Bonds, PPF, NPS, etc | 9 per user | type, name, amount_invested, current_value, returns |
| `goals` | Savings goals (Jars) | 3 per user | name, target_amount, saved_amount, deadline |
| `insights` | AI-generated nudges/insights | 5 per user | title, message, category, date, is_read |

---

