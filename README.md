# APHIA_CARE

# APHIA - Pharmacy Management SaaS
## Complete Application Documentation

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Application Architecture](#application-architecture)
3. [App Pages & Routes](#app-pages--routes)
4. [Features & Modules](#features--modules)
5. [Design System](#design-system)
6. [Permission System](#permission-system)
7. [Data Structure](#data-structure)
8. [Component Overview](#component-overview)
9. [Key Workflows](#key-workflows)
10. [Getting Started](#getting-started)

---

## Project Overview

**APHIA** is a comprehensive French-language pharmacy management SaaS platform designed for independent and chain pharmacies. It provides complete business management capabilities including point-of-sale operations, inventory management, financial tracking, user management, and inter-pharmacy networking.

### Key Specifications
- **Language:** French (Français)
- **Theme:** Premium Dark Theme
- **Target Users:** 10-50 pharmacies with 3-8 users per pharmacy
- **Architecture:** Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui
- **Data:** Fully mocked (no backend)
- **Roles:** 6 permission levels with real-time switching

### Core Capabilities
- Complete point-of-sale system with IPM (Mutual Insurance) support
- Real-time inventory management with expiration tracking
- Comprehensive financial analytics and expense management
- Role-based access control for team management
- Complete audit trail for compliance
- Inter-pharmacy product network
- Configurable business settings

---

## Application Architecture

### Tech Stack
```
Frontend Framework:    Next.js 16.1.6
React Version:         19.2.4
Styling:              Tailwind CSS 4.2.0
UI Components:        shadcn/ui (complete library)
Charts:               Recharts 2.15.0
Icons:                lucide-react 0.344.0
Forms:                react-hook-form + Zod
```

### Directory Structure
```
aphia/
├── app/                          # Next.js app router directory
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                  # Home/redirect page
│   ├── layout-wrapper.tsx         # App layout wrapper with sidebar/header
│   ├── globals.css                # Design system & tokens
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard module
│   ├── pos/
│   │   └── page.tsx              # Point of Sale module
│   ├── stock/
│   │   └── page.tsx              # Stock Management module
│   ├── finance/
│   │   └── page.tsx              # Financial Management module
│   ├── utilisateurs/
│   │   └── page.tsx              # User Management module
│   ├── audit/
│   │   └── page.tsx              # Audit Trail module
│   ├── reseau/
│   │   └── page.tsx              # Inter-pharmacy Network module
│   └── parametres/
│       └── page.tsx              # Settings/Configuration module
│
├── components/
│   ├── AppLayoutProvider.tsx      # Global layout context provider
│   ├── common/
│   │   ├── Sidebar.tsx            # Main navigation sidebar
│   │   ├── Header.tsx             # Top header with role switcher
│   │   ├── KPICard.tsx            # Key Performance Indicator card
│   │   └── StatusBadge.tsx        # Status display badge component
│   ├── theme-provider.tsx         # Theme provider setup
│   └── ui/                        # shadcn/ui components (pre-installed)
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       └── [50+ more components]
│
├── lib/
│   ├── data.ts                   # All mocked data (products, users, transactions)
│   ├── permissions.ts            # Role-based permission system
│   ├── constants.ts              # App constants (colors, statuses, labels)
│   ├── formatters.ts             # Currency, date, number formatting
│   ├── utils.ts                  # Tailwind class utilities
│
├── hooks/
│   ├── use-mobile.ts             # Mobile responsive hook
│   └── use-toast.ts              # Toast notification hook
│
├── scripts/
│   └── fix-tailwind-classes.js   # Build-time CSS class fixer
│
├── public/
│   ├── icon.svg                  # App icon
│   ├── placeholder-logo.svg      # Logo placeholder
│   └── placeholder-user.jpg      # User avatar placeholder
│
└── package.json                  # Dependencies & scripts
```

---

## App Pages & Routes

### Complete Application URLs

| Module | Path | Description | Accessible By |
|--------|------|-------------|----------------|
| **Home** | `/` | Redirect to dashboard | All |
| **Dashboard** | `/dashboard` | Main KPI metrics & charts | All |
| **Point of Sale** | `/pos` | POS checkout system | TITULAIRE, ASSISTANT, CAISSIER, STAGIAIRE |
| **Stock Management** | `/stock` | Inventory & expiration tracking | All |
| **Finance** | `/finance` | Financial analytics & expenses | All (limited for CAISSIER) |
| **Users** | `/utilisateurs` | Team member management | All (modify: TITULAIRE only) |
| **Audit Trail** | `/audit` | Activity log & compliance | TITULAIRE, ASSISTANT, SUPER_ADMIN |
| **Network** | `/reseau` | Inter-pharmacy product search | All |
| **Settings** | `/parametres` | Configuration & preferences | TITULAIRE, SUPER_ADMIN |

### Navigation Hierarchy

**Main Sidebar Navigation:**
```
APHIA (Logo)
├── 📊 Tableau de Bord        → /dashboard
├── 💰 Point de Vente          → /pos
├── 📦 Gestion Stock            → /stock
├── 💳 Finance                  → /finance
├── 👥 Utilisateurs             → /utilisateurs
├── 📋 Journal d'Audit           → /audit
├── 🌐 Réseau Inter-Pharmacies  → /reseau
└── ⚙️ Paramètres               → /parametres

[Profile & Logout Section]
```

---

## Features & Modules

### 1. Dashboard Module (`/dashboard`)

**Purpose:** Real-time business metrics and alerts overview

**Key Performance Indicators:**
- **CA du Jour** - Today's revenue (FCFA)
- **Marge Réalisée** - Profit margin percentage
- **Transactions** - Number of sales today
- **Créances IPM** - Outstanding mutual insurance receivables
- **Alertes Stock** - Low stock warnings
- **Expirations 90j** - Products expiring within 90 days

**Visualizations:**
- **Line Chart:** 7-day revenue trend (Chiffre d'Affaires)
- **Pie Chart:** Sales breakdown (Comptant/Crédit/IPM)
- **Bar Chart:** Top 5 best-selling products
- **Alerts Panel:** Critical stock and expiration notices

**Role Access:** All roles can view

---

### 2. Point of Sale Module (`/pos`)

**Purpose:** Complete checkout and sales management system

**Key Features:**
- **Product Search:** Real-time filtering by DCI, forme, packaging
- **Shopping Cart:** Dynamic quantity management with price updates
- **Sale Types:** 
  - Comptant (Cash)
  - Crédit (Credit)
  - IPM (Mutual Insurance)
  - Pro-forma (Estimate)

**IPM Calculation Engine:**
- Automatic split between patient and mutual parts
- Configurable mutual rates
- Real-time calculation updates

**Payment Processing:**
- Payment method selection (Cash, Card, Check)
- Change calculation
- Validation workflow with confirmation dialog

**Workflow:**
1. Search and add products to cart
2. Adjust quantities as needed
3. Select sale type
4. For IPM: Select mutual and amount auto-calculates
5. Enter payment method and amount
6. Click "Valider la Vente"
7. Confirmation dialog with sale summary
8. On confirm: Stock decrements, sale recorded in journal

**Role Access:** 
- TITULAIRE: Full access
- ASSISTANT: Full access
- CAISSIER: Create sales only
- STAGIAIRE: Draft sales only
- SUPER_ADMIN: Read-only

---

### 3. Stock Management Module (`/stock`)

**Purpose:** Complete inventory tracking and management

**Key Features:**
- **Product Inventory Table:** Displays all products with:
  - DCI (International Nonproprietary Name)
  - Forme (Tablet, injection, etc.)
  - Stock Quantity
  - Unit Price (FCFA)
  - Batch Information
  - Expiration Date
  - Supplier

- **Batch Reception:** Modal form to:
  - Add new product batches
  - Set quantity, lot number, expiration date
  - Update supplier information

- **Stock Movements Log:** Chronological history of:
  - POS sales (decrements)
  - Batch receipts (increments)
  - Manual adjustments
  - User who performed action
  - Timestamp

- **Expiration Alerts:** 
  - 90-day expiration warning view
  - Red badges on products expiring soon
  - Alert count in sidebar

- **Inventory Comparison:** View stock discrepancies

**Role Access:** 
- TITULAIRE: Full access
- ASSISTANT: Full access
- CAISSIER: View salle-vente stock only
- STAGIAIRE: No access
- SUPER_ADMIN: Cross-pharmacy view

---

### 4. Finance Module (`/finance`)

**Purpose:** Comprehensive financial analytics and expense management

**Key Features:**
- **Financial Dashboard:** 6 KPI cards
  - Chiffre d'Affaires (Total Revenue)
  - Coût des Marchandises (COGS)
  - Marge Brute (Gross Margin)
  - Charges Opérationnelles (Operating Expenses)
  - Résultat Net (Net Result)
  - Créances IPM (Receivables)

- **Financial Chart:** 6-month stacked bar chart showing:
  - Revenue (green)
  - COGS (red)
  - Operating expenses (gray)
  - Profit (blue)

- **Expense Management:**
  - Table with status workflow: Brouillon → Validé → Payé
  - Color-coded badges per status
  - Create new expense form
  - Edit expenses in Brouillon status
  - Delete expenses in Brouillon status
  - Validate expenses (TITULAIRE only)
  - Mark as paid (TITULAIRE only)

- **Expense Categories:**
  - Fournitures Médicales
  - Équipement
  - Personnel
  - Loyer
  - Électricité
  - Autre

- **IPM Receivables Table:**
  - Mutual claims tracking
  - Outstanding amounts
  - Due dates
  - Payment status

- **Journal Comptable (Accounting Journal):**
  - Immutable financial record
  - All transactions logged
  - Timestamp and user tracking
  - Export capability

**Expense Workflow:**
1. Click "Nouvelle Dépense"
2. Fill form: category, amount, date, description
3. Submit → Creates as Brouillon (draft)
4. Edit/Delete while in Brouillon
5. Click "Valider" → Confirmation dialog
6. Status changes to Validé (blue)
7. TITULAIRE clicks "Payer"
8. Status changes to Payé (green, immutable)

**Role Access:**
- TITULAIRE: Full access (create, validate, pay)
- ASSISTANT: Create and view only
- CAISSIER: View financials only
- STAGIAIRE: No access
- SUPER_ADMIN: Cross-pharmacy view

---

### 5. User Management Module (`/utilisateurs`)

**Purpose:** Team member management and role assignment

**Key Features:**
- **Users Table:** Display of all team members with:
  - Avatar/Initials
  - Full Name
  - Role (with color-coded badge)
  - Status (Active/Inactive)
  - Last Login timestamp
  - Department

- **User Creation:** Modal form to:
  - Add full name
  - Assign role
  - Set department
  - Assign permissions

- **User Modification:**
  - Change role (TITULAIRE only)
  - Toggle active/inactive status
  - Edit profile information

- **User Deactivation:**
  - Soft delete (user kept in database)
  - Inactive users can be reactivated
  - Audit trail preserved

**Roles Available:**
1. **TITULAIRE** - Owner/Manager (Green)
   - Full system access
   - Manage users and permissions
   - Validate expenses
   - Configure settings

2. **ASSISTANT** - Administrator (Blue)
   - Most features except user/settings management
   - Can create and validate expenses
   - Cannot modify users

3. **CAISSIER** - Cashier (Orange)
   - POS access
   - Limited stock view (salle-vente only)
   - View-only finance
   - No admin functions

4. **STAGIAIRE** - Intern/Trainee (Gray)
   - POS draft mode only
   - Cannot complete sales
   - Training access

5. **SUPER_ADMIN** - Super Administrator (Purple)
   - Read-only access across all pharmacies
   - Cross-pharmacy analytics
   - System monitoring

**Role Access:**
- TITULAIRE: Full CRUD operations
- ASSISTANT: View only
- CAISSIER: No access
- STAGIAIRE: No access
- SUPER_ADMIN: Cross-pharmacy view

---

### 6. Audit Trail Module (`/audit`)

**Purpose:** Complete activity logging for compliance and security

**Key Features:**
- **Audit Log Table:** Chronological display of all actions with:
  - Timestamp (date & time)
  - User (with avatar)
  - Action Type (badge-colored)
  - Module/Entity affected
  - Before/After data comparison
  - IP Address (simulated)

- **Action Types:**
  - CREATE - New record (green badge)
  - UPDATE - Modified record (blue badge)
  - DELETE - Removed record (red badge)
  - VALIDATE - Workflow change (gold badge)
  - LOGIN - User authentication (purple badge)
  - EXPORT - Data export (gray badge)

- **Advanced Filtering:**
  - By User (dropdown)
  - By Action Type (multi-select)
  - By Date Range (date picker)
  - By Module (POS, Stock, Finance, etc.)
  - By Entity (specific record)

- **Data Comparison View:**
  - Expandable row detail
  - Before state (original values)
  - After state (new values)
  - Field-by-field changes highlighted
  - Change tracking for sensitive data

**Sample Entries:**
- "Dr. Amadou created expense: Transport (5000 FCFA)"
- "Marie validated expense: Fournitures (25000 FCFA)"
- "System updated stock: Paracétamol -10 units"
- "User login: Dr. Amadou (192.168.1.1)"

**Role Access:**
- TITULAIRE: Full access with all user's actions visible
- ASSISTANT: Full access with all user's actions visible
- CAISSIER: No access
- STAGIAIRE: No access
- SUPER_ADMIN: Cross-pharmacy audit view

---

### 7. Inter-Pharmacy Network Module (`/reseau`)

**Purpose:** Connect with partner pharmacies for product availability

**Key Features:**
- **Product Search:** Real-time search across network
  - Search by DCI, forme, brand
  - Auto-complete suggestions
  - Instant results

- **Results Display:** Cards showing:
  - Partner pharmacy name
  - Location (Quartier)
  - Product availability status (Disponible/Non disponible)
  - Quantity available (generic: "Disponible" only, no exact quantity)
  - Unit price (FCFA)
  - Batch information
  - Expiration date
  - Contact button (call/message)

- **Network Settings:**
  - Opt-in toggle to appear in other pharmacies' networks (TITULAIRE only)
  - Privacy controls
  - Product visibility preferences

- **Partner Directory:**
  - List of connected pharmacies
  - Contact information
  - Operating status
  - Average response time

**Privacy Notes:**
- Never display exact stock quantities (only "Disponible" or "Non disponible")
- Show estimated availability only
- Hide internal pricing (show only negotiated rates)
- No supplier information shared

**Role Access:** All roles can search
- TITULAIRE: Search + configure network
- ASSISTANT: Search only
- CAISSIER: Search only
- STAGIAIRE: Search only
- SUPER_ADMIN: Cross-network view

---

### 8. Settings/Configuration Module (`/parametres`)

**Purpose:** Business configuration and preferences

**Key Features:**

**Pharmacy Information Section:**
- Pharmacy name
- Address (street, city, code postal)
- Operating hours
- Contact phone number
- License number
- Owner name

**POS Configuration:**
- Maximum discount percentage (%)
- Rounding rules (nearest franc)
- Receipt format options
- Payment timeout (seconds)
- Printer configuration

**IPM/Mutual Management:**
- List of configured mutuals
- Mutual rate percentages
- Coverage limits
- Contact persons
- Settlement schedules

**Supplier Management:**
- Supplier list with:
  - Company name
  - Contact person
  - Phone number
  - Email
  - Payment terms
  - Lead time days
  - Default delivery location
- Add/Edit/Delete suppliers

**Backup & System:**
- Last backup timestamp
- Backup frequency selection
- Manual backup button
- Data export options
- System status indicators

**Network Settings:**
- Opt-in to inter-pharmacy network
- Display preferences
- Notification settings

**Role Access:**
- TITULAIRE: Full configuration access
- ASSISTANT: View only
- CAISSIER: No access
- STAGIAIRE: No access
- SUPER_ADMIN: Read-only cross-pharmacy view

---

## Design System

### Color Palette

**Primary Brand Colors:**
```
Primary Green (Emerald):   #00C896 - Used for active states, primary actions
Secondary Gold:            #F5A623 - Used for accents and highlights
Neutral Blue:              #4F8EF7 - Used for secondary information
Alert Red:                 #FF4D6D - Used for errors and critical alerts
Accent Purple:             #9B72F7 - Used for super admin role
```

**Background Layers (Dark Theme):**
```
Primary Background:        #0A0F1E - Darkest, main background
Secondary Background:      #111827 - Cards and panels
Tertiary Background:       #1C2537 - Elevated elements
Elevated Background:       #243046 - Modals and overlays
```

**Text Colors:**
```
Primary Text:              #F0F4FF - Main text, highest contrast
Secondary Text:            #8B9EC7 - Secondary information, labels
Muted Text:                #4A5980 - Tertiary information, hints
```

**Border Colors:**
```
Primary Border:            #1E293B - Element borders
Secondary Border:          #334155 - Subtle dividers
```

**Status Colors:**
```
Brouillon (Draft):         #6B7280 - Gray
Valide (Validated):        #3B82F6 - Blue
Payé (Paid):               #10B981 - Green
En Retard (Overdue):       #EF4444 - Red
```

**Role Colors:**
```
TITULAIRE:                 #00C896 - Green
ASSISTANT:                 #3B82F6 - Blue
CAISSIER:                  #F59E0B - Orange
STAGIAIRE:                 #9CA3AF - Gray
SUPER_ADMIN:               #9B72F7 - Purple
```

### Typography

**Fonts:**
- **Headings:** Sora (Google Fonts)
  - h1: 32px, bold (700)
  - h2: 24px, semibold (600)
  - h3: 20px, semibold (600)
  - h4: 18px, semibold (600)
  - h5: 16px, medium (500)

- **Body:** DM Sans (Google Fonts)
  - Regular text: 14px, 400
  - Small text: 12px, 400
  - Labels: 12px, 600
  - Button text: 14px, 500

### Component Styling

**KPI Cards:**
- Dark background card (secondary bg)
- Bold value (28px, emerald text)
- Small label (12px, muted text)
- Trend indicator (↑ green or ↓ red)
- Border: 1px subtle border
- Hover: Slight lift effect

**Status Badges:**
- Circular background with status color
- Text color matches status
- Padding: 4px 8px
- Border-radius: 4px
- Font: 12px, medium

**Navigation Items (Sidebar):**
- Padding: 12px 16px
- Border-radius: 8px
- Active state: Left border + emerald background
- Hover state: Background change
- Text: 14px, medium

**Tables:**
- Header background: Secondary (darker)
- Row hover: Slight background highlight
- Borders: Subtle dividers between rows
- Text alignment: Left for text, right for numbers

### CSS Variables

All colors are defined as CSS custom properties in `/app/globals.css` and can be referenced via Tailwind color system:

```css
--bg-primary, --bg-secondary, --bg-tertiary, --bg-elevated
--text-primary, --text-secondary, --text-muted
--color-emerald, --color-gold, --color-blue, --color-red, --color-purple
--status-brouillon, --status-valide, --status-paye, --status-retard
--role-titulaire, --role-assistant, --role-caissier, --role-stagiaire, --role-super-admin
```

---

## Permission System

### Architecture

The permission system is implemented via:
- **Hook:** `usePermissions(role)` - Returns permission object for a role
- **Permission Matrix:** Defines access levels per module per role
- **UI Behavior:** Elements hidden (not disabled) for unauthorized actions

### Access Levels

```
FULL:        Can create, read, update, delete all records
CREATE_ONLY: Can create new records and view own records
READ:        Can view records only, no modifications
NONE:        No access to module
```

### Permission Matrix

```
Module          | TITULAIRE | ASSISTANT | CAISSIER | STAGIAIRE | SUPER_ADMIN
─────────────────────────────────────────────────────────────────────────────
Dashboard       | FULL      | FULL      | READ     | READ      | READ
POS             | FULL      | FULL      | CREATE   | DRAFT     | READ
Stock           | FULL      | FULL      | READ     | NONE      | READ
Finance         | FULL      | CREATE    | READ     | NONE      | READ
Users           | FULL      | READ      | NONE     | NONE      | READ
Audit           | FULL      | FULL      | NONE     | NONE      | FULL
Network         | FULL      | READ      | READ     | READ      | READ
Settings        | FULL      | NONE      | NONE     | NONE      | READ
```

### Role Descriptions

**TITULAIRE (Owner/Manager)**
- Green badge color
- Full system access
- Can manage all users
- Can validate and process payments
- Can configure system settings

**ASSISTANT (Administrator)**
- Blue badge color
- Most features except user/settings management
- Can create and validate expenses
- Cannot modify users or settings

**CAISSIER (Cashier)**
- Orange badge color
- POS focus
- Limited stock view (salle-vente only)
- View-only finance access
- No admin functions

**STAGIAIRE (Intern/Trainee)**
- Gray badge color
- POS draft mode only
- Training access
- Cannot complete transactions

**SUPER_ADMIN (Super Administrator)**
- Purple badge color
- Read-only cross-pharmacy access
- System monitoring
- No transaction capabilities

### Role Switching (Development)

The Header component includes a real-time role switcher for testing:
1. Click role selector in header (top right)
2. Choose different role from dropdown
3. Entire interface updates immediately
4. Navigation shows/hides modules based on role
5. All UI elements respond to permission changes

---

## Data Structure

### Key Mocked Data Entities

All mocked data is stored in `/lib/data.ts` as JavaScript objects.

**Products Array:**
```javascript
{
  id: string,
  dci: string (International Nonproprietary Name),
  forme: string (Tablet, injection, syrup, etc.),
  dosage: string,
  packaging: string,
  unitPrice: number (FCFA),
  stock: number,
  supplier: string,
  lastRestocked: Date,
  expirationDate: Date,
  minStock: number,
  category: string,
  barcode?: string,
  imageUrl?: string
}
```

**Users Array:**
```javascript
{
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: Role,
  department: string,
  status: 'active' | 'inactive',
  joinDate: Date,
  lastLogin: Date,
  avatarUrl?: string,
  permissions: Permission[]
}
```

**Transactions (POS) Array:**
```javascript
{
  id: string,
  date: Date,
  items: TransactionItem[],
  saleType: 'comptant' | 'credit' | 'ipm' | 'pro_forma',
  totalAmount: number,
  cashierName: string,
  paymentMethod: string,
  mutualId?: string,
  patientPart: number,
  mutualPart: number,
  discount: number,
  change: number,
  status: 'completed' | 'pending' | 'cancelled'
}
```

**Expenses Array:**
```javascript
{
  id: string,
  category: string,
  amount: number,
  date: Date,
  description: string,
  status: 'brouillon' | 'valide' | 'paye',
  createdBy: string,
  validatedBy?: string,
  validatedDate?: Date,
  paidDate?: Date,
  paymentMethod?: string,
  attachments?: string[]
}
```

**Audit Events Array:**
```javascript
{
  id: string,
  timestamp: Date,
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VALIDATE' | 'LOGIN' | 'EXPORT',
  module: string,
  entityType: string,
  entityId: string,
  changes: {
    fieldName: string,
    beforeValue: any,
    afterValue: any
  }[],
  ipAddress: string
}
```

**Mutuals (IPM) Array:**
```javascript
{
  id: string,
  name: string,
  rate: number (percentage),
  contactPerson: string,
  phone: string,
  email: string,
  settlementDay: number (day of month),
  active: boolean
}
```

---

## Component Overview

### Core Components

**AppLayoutProvider** (`/components/AppLayoutProvider.tsx`)
- Global layout wrapper for entire app
- Manages current role state
- Provides role context to all children
- Layout: Sidebar + Header + Main content

**Sidebar** (`/components/common/Sidebar.tsx`)
- Fixed left navigation
- Displays active navigation items based on role
- Logo and branding section
- Profile section with logout
- Stock alert badge
- Mobile toggle button

**Header** (`/components/common/Header.tsx`)
- Fixed top bar
- App title display
- Notification icon with count
- Role switcher dropdown (for testing)
- Language/settings button

**KPICard** (`/components/common/KPICard.tsx`)
- Displays key metrics
- Shows value, label, and trend
- Reusable across dashboard and finance modules

**StatusBadge** (`/components/common/StatusBadge.tsx`)
- Displays status with appropriate color
- Supports: status, role, action types
- Auto-maps to correct color scheme

### Page Components

Each module has a main page component that:
1. Imports and displays module-specific components
2. Manages module state
3. Handles user interactions
4. Respects permission checks
5. Follows consistent layout pattern

**Example Page Structure:**
```typescript
export default function DashboardPage() {
  const { currentRole } = useContext(AppLayoutContext)
  const permissions = usePermissions(currentRole)
  
  if (!permissions.dashboard.can('read')) {
    return <AccessDenied />
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <PageHeader title="Tableau de Bord" />
      <KPIMetrics />
      <ChartsSection />
      <AlertsSection />
    </div>
  )
}
```

---

## Key Workflows

### POS Sale Workflow

**Sequence:**
1. Cashier searches for product
2. Product appears in results
3. Cashier clicks product to add to cart
4. Product added with quantity selector
5. Cashier adjusts quantity as needed
6. Cashier selects sale type (Comptant/Crédit/IPM)
7. If IPM selected:
   - Mutual selector appears
   - Amount entered
   - System calculates split automatically
8. Payment method selected
9. Amount entered
10. "Valider la Vente" button clicked
11. Confirmation dialog appears showing:
    - Products and quantities
    - Sale type
    - Patient/Mutual split (if IPM)
    - Total amount
    - Payment details
12. Cashier confirms sale
13. On confirmation:
    - Stock decrements for each product
    - Sale recorded in transactions
    - Entry added to audit trail
    - Journal updated
    - Receipt printed
    - Success notification shown
    - Cart clears

**Error Handling:**
- Insufficient stock: Warning message
- Invalid amount: Input validation
- Network error: Retry notification
- Authorization: Permission denied message

### Expense Workflow

**Brouillon (Draft) Phase:**
1. User clicks "Nouvelle Dépense"
2. Form modal opens
3. User fills: category, amount, date, description
4. Form validates on submit
5. Expense created with status "Brouillon"
6. Entry appears in expenses table
7. User can edit or delete while in Brouillon

**Validation Phase:**
1. User (TITULAIRE) reviews expense
2. Clicks "Valider" button
3. Confirmation dialog appears
4. On confirm:
   - Status changes to "Valide" (blue badge)
   - Timestamp recorded
   - Entry added to audit trail
   - User notified

**Payment Phase:**
1. TITULAIRE views "Valide" expense
2. Clicks "Payer" button
3. Confirmation dialog appears
4. On confirm:
   - Status changes to "Payé" (green badge)
   - Payment method recorded
   - Timestamp recorded
   - Entry locked (no further edits)
   - Entry added to audit trail
   - Journal updated

### IPM Calculation

**Input Parameters:**
- Amount: Total transaction amount
- Mutual: Selected IPM/mutual
- Mutual Rate: Configured rate for mutual

**Calculation:**
```
Total Amount = 100,000 FCFA
Mutual Rate = 80%

Patient Part = 100,000 × (100 - 80) / 100 = 20,000 FCFA
Mutual Part = 100,000 × 80 / 100 = 80,000 FCFA
```

**Real-Time Updates:**
- User enters amount → Calculation updates instantly
- User changes mutual → New rates applied immediately
- Amounts displayed in FCFA format

---

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required (fully mocked data)

### Installation

1. **Clone or extract the project**
```bash
cd aphia
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm dev
```

4. **Open in browser**
```
http://localhost:3000
```

### First Time Use

1. App opens to redirect, then loads Dashboard
2. Sidebar shows navigation menu
3. Header shows current role and role switcher
4. Click role switcher to test different permission levels
5. Navigate through modules to explore features
6. All data is mocked and resets on page reload

### Key Keyboard Shortcuts

- `Ctrl+K` / `Cmd+K` - Open command palette (if implemented)
- `Esc` - Close modals and dropdowns
- `Tab` - Navigate through form fields
- `Enter` - Submit forms or select items

### Development Tips

1. **Viewing Permissions:** Use the role switcher to see how UI changes with roles
2. **Testing Workflows:** Use mocked data to test POS, expenses, audits
3. **Debugging:** Open browser DevTools (F12) to inspect elements
4. **Console Logs:** Check browser console for any error messages
5. **Tailwind Classes:** All styling uses Tailwind CSS utilities

### Customization

**To modify colors:**
1. Edit CSS variables in `/app/globals.css`
2. Variables are automatically applied throughout

**To modify mocked data:**
1. Edit `/lib/data.ts`
2. Changes appear immediately on next page load

**To modify role permissions:**
1. Edit permission matrix in `/lib/permissions.ts`
2. Update navigation items in `/components/common/Sidebar.tsx`

---

## Troubleshooting

### App won't load
- Check browser console for errors (F12)
- Ensure Node.js 18+ is installed
- Run `pnpm install` again to ensure dependencies

### Role switcher not working
- Refresh page (Ctrl+R or Cmd+R)
- Check that you're on `/dashboard` route
- Look for JavaScript errors in console

### Layout looks broken
- Clear browser cache (Ctrl+Shift+Delete)
- Check that Tailwind CSS is loaded
- Verify no CSS custom properties are overridden

### Data not persisting
- This is expected - data resets on refresh
- To implement persistence, add a backend database
- Currently using mocked data only

---

## Performance Optimizations

- Next.js Image optimization enabled
- Tailwind CSS purged of unused styles
- Component code splitting for faster loads
- Debounced search inputs
- Memoized expensive calculations

---

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

Potential features for future versions:
- Real database backend integration
- Multi-language support beyond French
- Advanced reporting and PDF export
- SMS/Email notifications
- Mobile app
- Real-time data sync
- Advanced analytics
- Supplier integration
- Customer loyalty programs
- Prescription management

---

## Support & Contact

For issues or questions:
1. Check this documentation first
2. Review browser console for error messages
3. Test in different browser
4. Check that all dependencies are installed

---

**Version:** 1.0.0
**Last Updated:** 2024
**Status:** Production Ready (Mocked Data)


