# BACKEND IMPLEMENTATION (Appwrite Console)

## Phase B1: Project Foundation

### Step B1.1: Create Appwrite Project

1. Navigate to [Appwrite Console](https://cloud.appwrite.io)
2. Click "Create Project" and name it "FinWise"
3. Note your Project ID - you'll need this later
4. Select your region (closest to your target users)

### Step B1.2: Configure Authentication

1. Go to "Auth" section in left sidebar
2. Click "Settings" tab
3. Enable "Email/Password" provider
4. Configure session length (recommend 30 days)
5. Under "Teams", create a default team if needed for shared budgets

### Step B1.3: Register Platform

1. Go to "Overview" → "Add Platform"
2. Select "React Native" (or "Flutter" depending on your stack)
3. Enter app name: "FinWise Mobile"
4. Add bundle ID/package name: `com.yourcompany.finwise`
5. Save the generated platform ID

### Step B1.4: Set Up Environment Variables

1. In Appwrite Console, go to "Settings" → "Environment Variables"
2. Add any global variables (none needed initially)
3. Note: API keys will be configured later for cloud functions

```
inside appwriteFunction folder create .env file and add the following variables

OPENROUTER_API_KEY=*****
```

## Phase B2: Database Design

### Step B2.1: Create Database

1. Navigate to "Databases" section
2. Click "Create Database"
3. Name: `finwise_db`
4. Set ID (auto-generated or custom)
5. Enable "Advanced Security" options

### Step B2.2: Users Collection Setup

1. Inside your database, click "Create Collection"
2. Name: `user_profiles`
3. Set Collection ID: `user_profiles`

**Add Attributes:**

- `userId` (string, required) - References Appwrite auth user ID
- `displayName` (string, required) - User's full name
- `email` (string, required) - User's email
- `avatar` (string, optional) - Profile picture URL
- `monthlyIncome` (float, optional) - For budget calculations
- `currency` (string, default: "USD") - Preferred currency
- `createdAt` (datetime, auto-generated)
- `updatedAt` (datetime, auto-updated)

**Set Indexes:**

- `userId_idx` on `userId` field (unique)

**Configure Permissions:**

- Create: `role:all`
- Read: `user:$userId`
- Update: `user:$userId`
- Delete: `user:$userId`

### Step B2.3: Expenses Collection Setup

1. Click "Create Collection"
2. Name: `transactions`
3. Collection ID: `transactions`

**Add Attributes:**

- `title` (string, required) - Transaction description
- `amount` (float, required) - Monetary value
- `type` (enum: "expense", "income", required)
- `category` (string, required) - Category identifier
- `date` (datetime, required) - Transaction date
- `userId` (string, required) - Owner reference
- `notes` (string, optional) - Additional details
- `receiptImageId` (string, optional) - Reference to storage file
- `tags` (array of strings, optional) - For filtering
- `isRecurring` (boolean, default: false)
- `createdAt` (datetime, auto-generated)

**Set Indexes:**

- `user_date_idx` on `userId` and `date` (descending)
- `user_category_idx` on `userId` and `category`

**Configure Permissions:**

- Create: `user:$userId`
- Read: `user:$userId`
- Update: `user:$userId`
- Delete: `user:$userId`

### Step B2.4: Budgets Collection Setup

1. Click "Create Collection"
2. Name: `budgets`
3. Collection ID: `budgets`

**Add Attributes:**

- `category` (string, required) - Category this budget applies to
- `amount` (float, required) - Monthly budget limit
- `month` (string, required) - Format: YYYY-MM
- `userId` (string, required) - Owner reference
- `notificationThreshold` (float, default: 80) - Percentage to trigger alerts
- `color` (string, optional) - UI color code
- `icon` (string, optional) - Icon identifier
- `createdAt` (datetime, auto-generated)

**Set Indexes:**

- `user_month_idx` on `userId` and `month`
- `user_category_month_idx` composite index

**Configure Permissions:**

- Create: `user:$userId`
- Read: `user:$userId`
- Update: `user:$userId`
- Delete: `user:$userId`

## Phase B3: Storage Configuration

### Step B3.1: Create Storage Bucket

1. Go to "Storage" section
2. Click "Create Bucket"
3. Name: `receipts`
4. Bucket ID: `receipts`

**Configure Settings:**

- Maximum file size: 10 MB
- Allowed file types: `image/jpeg`, `image/png`, `image/heic`, `application/pdf`
- Enable "File security" for user isolation
- Enable "Encryption" for sensitive documents

**Set Permissions:**

- Create: `user:$userId`
- Read: `user:$userId`
- Update: `user:$userId`
- Delete: `user:$userId`

## Phase B4: Cloud Functions

### Step B4.1: AI Assistant Function Setup

1. Navigate to "Functions" section
2. Click "Create Function"
3. Name: `ai-financial-assistant`
4. Runtime: Node.js 18+ (or Python 3.9+)
5. Permissions: Enable access to database and storage

**Environment Variables:**

- `OPENAI_API_KEY` (or Anthropic/other LLM provider key)
- `DATABASE_ID` from your database
- `COLLECTION_TRANSACTIONS_ID`

**Function Code Structure:**

```javascript
// Main handler that processes user queries
// Fetches user's recent transactions
// Constructs context about spending patterns
// Calls LLM with financial context
// Returns personalized advice
```
