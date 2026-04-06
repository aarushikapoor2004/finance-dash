# Finance Dashboard — Zorvyn

A personal finance tracking web application built with React 19, Zustand, Recharts, and Framer Motion. The project focuses on clean UI, real-time state management, and interactive data visualization.

---

## Live Demo

[https://finance-dash.aarushi.art](https://finlethic.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Pages & Components](#pages--components)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)

---

## Overview

Zorvyn is a single-page personal finance dashboard that allows users to track income and expenses, visualize spending patterns, and get smart financial insights — all without a backend. All data is managed client-side using Zustand with localStorage persistence.

The application supports two user roles — **Admin** (full CRUD access) and **Viewer** (read-only) — making it suitable as a demonstration of role-based access control in a frontend-only app.

---

## Features

### Core Functionality
- **Transaction Management** — Add, edit, and delete income/expense transactions via a modal form
- **Category System** — 15 predefined categories (Salary, Freelance, Investment, Food & Dining, Rent, etc.) each with a unique icon and color
- **Search** — Global search bar filters transactions by description or category in real time
- **Sorting & Filtering** — Sort transactions by date (newest/oldest) or amount (highest/lowest); filter by type (income/expense) or category

### Dashboard
- Summary cards showing Total Balance, Total Income, Total Expenses, and Savings Rate — all with animated count-up on load
- Area chart showing monthly income vs. expenses over the last 9 months
- Bar chart showing daily spending for the current week
- Donut/pie chart breaking down expenses by category with an interactive active-sector highlight
- Recent transactions table with category icons, color-coded amounts, and inline edit/delete controls

### Insights Page
- Month-over-month expense and income change percentages
- Top spending category analysis
- AI-style smart message that adapts based on your actual spending data (e.g., warns you if spending is up >15%, congratulates you on good savings rate)
- Animated stat cards with micro sparkline bar charts
- Monthly trend area chart and category breakdown bar chart

### UX & Design
- **Dark/Light mode** toggle with CSS variable–based theming and localStorage persistence
- **Animated page transitions** using Framer Motion's `AnimatePresence` with blur + slide effects
- **Responsive layout** — collapsible sidebar on desktop, slide-in drawer on mobile
- **Toast notifications** — success/error/info toasts with auto-dismiss after 3.5 seconds
- **Role-based access** — `RoleGuard` component supports hide, lock (blur overlay), and disable modes
- Ambient gradient orbs in the background for a premium dark-mode aesthetic

---

## Tech Stack

| Category | Library / Tool | Version |
|---|---|---|
| UI Framework | React | 19 |
| Build Tool | Vite | 8 |
| Styling | Tailwind CSS | 3 |
| Charts | Recharts | 3 |
| Animations | Framer Motion | 12 |
| State Management | Zustand | 5 |
| Icons | Lucide React | latest |
| Linting | ESLint | 9 |
| Package Manager | pnpm | — |

---

## Project Structure

```
finance-dashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── form/
│   │   │   ├── AmountInput.jsx       # Amount field with +/- prefix indicator
│   │   │   ├── CategoryPicker.jsx    # Grid of category buttons with icons
│   │   │   └── Field.jsx             # Generic labeled input wrapper
│   │   ├── shared/
│   │   │   ├── CategoryMeta.js       # Icon + color map for all 15 categories
│   │   │   ├── ChartCard.jsx         # Reusable chart container with legend support
│   │   │   ├── ChartTooltip.jsx      # Custom styled Recharts tooltip
│   │   │   └── GradientBar.jsx       # SVG gradient definition component
│   │   ├── EmptyState.jsx            # Empty list placeholder with icon
│   │   ├── Navbar.jsx                # Top bar with search, theme toggle, role switcher
│   │   ├── RoleGuard.jsx             # Access control component (hide/lock/disable modes)
│   │   ├── Sidebar.jsx               # Navigation sidebar (collapsible)
│   │   ├── SummaryCard.jsx           # KPI card with animated count-up
│   │   ├── ToastContainer.jsx        # Stack of toast notification elements
│   │   ├── TransactionForm.jsx       # Add/Edit transaction modal
│   │   └── TransactionTable.jsx      # Sortable, filterable transaction list
│   ├── data/
│   │   └── mockData.js               # Seed transactions + monthly/weekly chart data
│   ├── hooks/
│   │   └── useCountUp.js             # Custom hook for animating numbers
│   ├── pages/
│   │   ├── Dashboard.jsx             # Main overview page
│   │   ├── Insights.jsx              # Analytics & smart insights page
│   │   └── Transactions.jsx          # Full transaction management page
│   ├── store/
│   │   └── store.js                  # Zustand store (all global state + computed values)
│   ├── styles/                       # Extra CSS (custom animations etc.)
│   ├── App.css
│   ├── App.jsx                       # Root: layout, sidebar, page routing
│   ├── index.css                     # CSS variables for theming
│   └── main.jsx                      # React DOM entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Architecture & Design Decisions

### Single-Page Application (No Router)
Rather than using React Router, navigation is handled entirely through Zustand state (`activePage`). The `App.jsx` component maps the active page key to the corresponding page component and renders it inside an `AnimatePresence` block for smooth transitions. This keeps the bundle lean and avoids URL-based routing for a dashboard that doesn't need deep linking.

### CSS Variables for Theming
All colors are defined as CSS custom properties (e.g., `--bg-body`, `--text-heading`, `--border-card`) in `index.css`. The dark and light themes are two sets of these variables toggled by a `.dark` class on `<html>`. This approach means Tailwind utility classes can coexist with theme-aware styles without duplicating values.

### Zustand Store as Single Source of Truth
All application state lives in one Zustand store (`store.js`). This includes:
- Theme and sidebar state
- Role (admin/viewer)
- The transactions array
- Modal open/close state
- Toast queue
- Computed selectors (getSummary, getInsights, getWeeklySpending, getExpenseBreakdown)

Computed values are implemented as functions inside the store rather than derived in components. This centralizes business logic and makes it easy to reuse across pages.

### LocalStorage Persistence
State that should survive a page refresh (theme, transactions, sidebar state, role) is persisted to localStorage using a `zorvyn_` prefix. Persistence is manual — the store explicitly calls `saveState()` after each mutation — rather than using a middleware plugin, keeping the flow easy to trace.

### RoleGuard Component
The `RoleGuard` component is a flexible access control primitive that supports three rendering modes:

- **`hide`** — renders children only if the user has the required role; otherwise renders an optional fallback
- **`lock`** — always renders children but overlays a blur + lock icon for unauthorized users
- **`disable`** — uses a render prop pattern, passing a `canEdit` boolean into children

This makes it easy to apply access rules consistently without repeating `if (role !== 'admin')` checks throughout components.

---

## Pages & Components

### Dashboard (`/src/pages/Dashboard.jsx`)
The landing page. Displays four `SummaryCard` components (balance, income, expenses, savings rate), three Recharts visualizations (area chart, bar chart, donut chart), and a `TransactionTable` showing the 5 most recent transactions.

Key implementation details:
- The pie chart uses a custom `ActivePieShape` render function for the interactive expand-on-hover sector
- Chart colors are defined as design tokens at the top of the file for consistency
- The area chart uses SVG gradient definitions from `GradientBar`

### Transactions (`/src/pages/Transactions.jsx`)
Full CRUD interface for all transactions. Features search, multi-criteria filtering (type + category), and four sort modes. Uses `AnimatePresence` to animate rows in/out as filters change.

Admin/Viewer enforcement: the Add button and inline Edit/Delete buttons are wrapped in `RoleGuard` — they are hidden from viewers, who see a lock indicator instead.

### Insights (`/src/pages/Insights.jsx`)
Computed analytics page. All metrics are derived from the real transaction array via `getInsights()` in the store — no hardcoded numbers. The smart message logic compares current vs. last month expenses and savings rate to generate a contextual recommendation.

Cards use Framer Motion's `useMotionValue` + `useTransform` + `useSpring` for a 3D tilt-on-hover effect.

### TransactionForm (`/src/components/TransactionForm.jsx`)
A modal dialog for adding and editing transactions. Pre-fills all fields when editing. Uses sub-components from `src/components/form/` for the amount field, category picker grid, and generic labeled inputs. Dispatches `addTransaction` or `updateTransaction` to the store on submit.

### SummaryCard (`/src/components/SummaryCard.jsx`)
Accepts a label, value, icon, and color config. Animates the displayed number from 0 to its target value on mount using the `useCountUp` custom hook.

---

## State Management

All state and logic is in `/src/store/store.js` (Zustand).

```
State Shape
├── theme                   "dark" | "light"
├── role                    "admin" | "viewer"
├── activePage              "dashboard" | "transactions" | "insights"
├── sidebarOpen             boolean
├── mobileSidebarOpen       boolean
├── globalSearch            string
├── transactions            Transaction[]
├── showTransactionForm     boolean
├── editingTransaction      Transaction | null
└── toasts                  Toast[]

Actions
├── toggleTheme()
├── setRole(role)
├── setActivePage(page)
├── toggleSidebar()
├── setGlobalSearch(query)
├── addTransaction(txn)
├── deleteTransaction(id)
├── updateTransaction(id, updates)
├── openTransactionForm(txn?)
├── closeTransactionForm()
├── addToast(message, type)
└── removeToast(id)

Computed (functions)
├── getSummary()            → { totalIncome, totalExpenses, balance, savingsRate }
├── getWeeklySpending()     → [{ day, amount }] × 7
├── getExpenseBreakdown()   → [{ name, value, color }]
├── getSearchResults()      → Transaction[] (filtered by globalSearch)
└── getInsights()           → full analytics object with smart message
```

---

## Data Flow

```
User Action (click Add / edit form / toggle role)
        ↓
Component calls store action  (e.g. addTransaction)
        ↓
Store updates state + saves to localStorage
        ↓
All subscribed components re-render with new data
        ↓
Toast notification fires (via setTimeout to avoid render batching issues)
```

Chart data is computed on every render by calling store selector functions (`getExpenseBreakdown()`, `getWeeklySpending()` etc.) inside the page component. Since Zustand re-renders only subscribed components when their slice of state changes, this is efficient enough for this scale of data.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- pnpm (or npm as a fallback)

### Installation

```bash
# Clone the repository
git clone https://github.com/aarushikapoor2004/finance-dash.git
cd finance-dash

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> The app seeds itself with 20 realistic mock transactions on first load. All changes you make are saved to `localStorage` under the `zorvyn_` prefix and persist across page refreshes.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server with hot module replacement |
| `pnpm build` | Build an optimized production bundle to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint across all source files |

---

## Deployment

The app is deployed to Vercel at [finlethic.vercel.app](https://finlethic.vercel.app). Since it is a fully static SPA (no backend, no API keys), it can be deployed to any static hosting platform:

```bash
pnpm build
# Upload the dist/ folder to Vercel, Netlify, GitHub Pages, or Cloudflare Pages
```

