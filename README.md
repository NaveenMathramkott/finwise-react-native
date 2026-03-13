# **FinWise - Personal AI Finance Management App**

FinWise is a comprehensive personal finance management application designed to empower users to take control of their financial well-being. With a suite of intelligent features powered by AI, FinWise simplifies expense tracking, provides actionable insights, and helps users achieve their financial goals.

## Core Functionalities & User Benefits

#### **1. Smart Expense Tracking**

- Manual Entry: Users can log expenses with amount, category, date, and notes
- Receipt Scanning : Use device camera to extract expense details via AI
- Recurring Expenses: Set up monthly bills (rent, subscriptions) for automatic tracking

#### **2. AI-Powered Financial Chatbot**

- Natural Language Queries: "How much did I spend on coffee this month?"
- Spending Analysis: "Show me my largest expense categories"
- Budget Advice: "I want to save $500 this month, what should I cut?"
- Predictive Insights: "Based on my spending, what will I spend next month?"

#### **3. Visual Analytics Dashboard**

- Spending by Category: Pie charts showing where money goes
- Daily/Weekly Trends: Line graphs of spending patterns
- Budget Progress: Visual bars showing spending vs. budget

#### **4. Financial Health Score**

- AI calculates a score based on:
- Savings rate
- Expense consistency
- Debt-to-income ratio
- Emergency fund status

#### **5. Smart Alerts & Recommendations**

- "You've spent 80% of your dining budget"
- "Unusual spending detected in shopping category"
- "Consider switching to a cheaper subscription"

## **🏗️ Project Architecture**

The application is built using **React Native** with **Expo** and follows a modular structure where concerns are separated into distinct directories.

- **Frontend**: React Native, Expo
- **UI Framework**: React Native Paper
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Styling**: Vanilla CSS (within `StyleSheet`) & React Native Paper Theming
- **Charts**: Victory Native
- **Forms**: React Hook Form

## 📂 Directory Structure

```text
/
├── App.tsx             # Root component, Store & Paper Provider setup
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
└── src/
    ├── components/     # Reusable UI components
    ├── hooks/          # Custom React hooks
    ├── navigation/     # Navigation stacks and tabs configuration
    ├── redux/          # State management (store, slices, selectors)
    ├── screens/        # Application screens (organized by flow)
    ├── services/       # API and external services
    └── utils/          # Helper functions, themes, and constants
```

## 🗺️ Navigation Map

The app uses a conditional navigation flow based on the authentication state (`isAuthenticated`).

### Root Navigator ([AppNavigator.tsx](file:///n:/Prjects_AI/finwise/src/navigation/AppNavigator.tsx))

- **Unauthenticated**: [AuthStack](file:///n:/Prjects_AI/finwise/src/navigation/AuthStack.tsx#11-21)
- **Authenticated**: [MainTabNavigator](file:///n:/Prjects_AI/finwise/src/navigation/MainTabNavigator.tsx#52-86)

### Auth Stack ([AuthStack.tsx](file:///n:/Prjects_AI/finwise/src/navigation/AuthStack.tsx))

- `Onboarding`: Welcome and introduction.
- `Login`: User authentication.
- `Register`: New user sign-up.
- `ForgotPassword`: Password recovery.

### Main Tab Navigator ([MainTabNavigator.tsx](file:///n:/Prjects_AI/finwise/src/navigation/MainTabNavigator.tsx))

1. **Dashboard**: Overview of finances, charts, and summary.
2. **Expenses**: Manage expenses (Stack Navigator).
   - `ExpensesList`: List of all transactions.
   - `AddExpense`: Form to add new expenses.
   - `Budget`: Set and view budgets.
3. **AI Assistant**: Interactive financial assistant.
4. **Reports**`: Financial analytics and trends.
5. **Profile**: User settings and profile management (Stack Navigator).
   - `CurrentProfile`: Profile overview.
   - `EditProfile`: Update user details.
   - `ChangePassword`: Security settings.
   - `Support` / `About`: App information.

## 💾 State Management (Redux)

The application state is managed using Redux Toolkit, centered in [src/redux/store.ts](file:///n:/Prjects_AI/finwise/src/redux/store.ts).

| Slice          | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `auth`         | Manages user session, login status, and user data.           |
| `expenses`     | Stores transaction history, categories, and expense logic.   |
| `budget`       | Manages monthly/category budgets and tracking.               |
| `ai assistant` | Handles chat history and interactions with the AI assistant. |
| `ui`           | App-wide UI state (theme, loading indicators).               |

## 🎨 Theme & Styling

- **Colors**: Defined in [src/utils/theme.ts].
- **Primary Color**: `COLORS.primary` (typically used for actions and active states).
- **Theming**: Integrated with `react-native-paper` for consistent component styling.

## 🛠️ Key Components & Libraries

- **`VictoryNative`**: Used for rendering financial charts in Dashboard and Reports.
- **`React Hook Form`**: Efficient form management in `AddExpense` and Auth screens.
- **`Expo Secure Store`**: Used for persisting auth tokens securely.
- **`Ionicons`**: Vector icons used throughout the navigation and UI.

---
