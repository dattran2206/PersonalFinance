# Personal Finance Manager MVP Todo
## config Project

## Core Files to Create/Modify:
1. **src/pages/Index.tsx** - Main dashboard with balance overview, spending summary, and savings goals
2. **src/pages/AddTransaction.tsx** - Transaction entry form with quick buttons and category selection
3. **src/pages/Transfer.tsx** - Wallet-to-wallet transfer form
4. **src/pages/SavingGoals.tsx** - Savings goals management with progress tracking
5. **src/components/Navigation.tsx** - Main navigation component
6. **src/components/TransactionCard.tsx** - Reusable transaction display component
7. **src/components/WalletCard.tsx** - Wallet balance display component
8. **src/App.tsx** - Update routing for new pages

## Data Structure (localStorage):
- Wallets: [{ id, name, balance, type }]
- Transactions: [{ id, amount, category, wallet, type, note, date }]
- SavingGoals: [{ id, name, target, saved, progress }]

## Features Implementation:
1. **Dashboard**: Total balance calculation, category spending charts, goals progress
2. **Add Transaction**: Quick buttons, category/wallet selectors, amount input
3. **Transfer**: Source/target wallet selection, amount transfer
4. **Saving Goals**: Goal creation, progress tracking, contribution buttons

## Design Elements:
- Card-based layout with rounded corners and shadows
- Color coding: green (savings), red (expenses), blue (income)
- Responsive PC-first design
- Quick-action buttons for common transactions