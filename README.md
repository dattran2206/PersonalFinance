# Project Summary
The project is a **Personal Finance Manager WebApp** designed to help users track their finances effectively. It provides a modern and minimal interface where users can manage their wallets, record transactions, and set saving goals. The app focuses on a clean, intuitive design, enabling users to view their financial summaries, categorize expenses, and monitor progress towards financial goals.

# Project Module Description
1. **Dashboard**: Displays total wallet balance, spending summaries by category, and progress on saving goals.
2. **Add Transaction Page**: Allows users to quickly log expenses or income with minimal typing and quick-select buttons for common transactions.
3. **Transfer Page**: Facilitates money transfers between different wallets.
4. **Saving Goals Page**: Enables users to create and manage saving goals, tracking their progress towards targets.

# Directory Tree
```
shadcn-ui/
├── README.md                # Project overview and setup instructions
├── components.json          # Component configuration
├── eslint.config.js         # ESLint configuration file
├── index.html               # Main HTML file
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── public/                  # Public assets
│   ├── favicon.svg          # Favicon for the app
│   └── robots.txt           # Robots.txt for web crawlers
├── src/                     # Source code directory
│   ├── App.css              # Global styles
│   ├── App.tsx              # Main app component
│   ├── components/          # Reusable components
│   │   ├── Navigation.tsx   # Navigation component
│   │   ├── TransactionCard.tsx # Transaction display component
│   │   └── WalletCard.tsx   # Wallet display component
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Page components
│   │   ├── AddTransaction.tsx # Transaction entry page
│   │   ├── Index.tsx        # Dashboard page
│   │   ├── NotFound.tsx     # 404 page
│   │   ├── SavingGoals.tsx  # Saving goals management page
│   │   └── Transfer.tsx     # Money transfer page
│   ├── lib/                 # Utility functions
│   ├── main.tsx             # Application entry point
│   ├── vite-env.d.ts        # TypeScript definitions for Vite
│   ├── vite.config.ts       # Vite configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

# File Description Inventory
- **README.md**: Overview and setup instructions for the project.
- **components.json**: Configuration for UI components.
- **eslint.config.js**: ESLint rules and settings.
- **index.html**: Entry point for the web application.
- **package.json**: Lists dependencies and scripts for building and running the project.
- **postcss.config.js**: Configuration for PostCSS.
- **public/**: Contains static assets like favicon and robots.txt.
- **src/**: Contains all source code, including components, pages, and styles.

# Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Query
- **Build Tool**: Vite
- **Linting**: ESLint
- **Styling**: PostCSS, Tailwind CSS

# Usage
1. Install dependencies:
   ```
   pnpm install
   ```
2. Run lint check:
   ```
   pnpm run lint
   ```
3. Build the project:
   ```
   pnpm run build
   ```
