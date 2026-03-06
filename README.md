# APHIA_CARE

APHIA - Pharmacy Management SaaS
Complete Application Documentation
￿ Table of Contents
1. Project Overview
2. Application Architecture
3. App Pages & Routes
4. Features & Modules
5. Design System
6. Permission System
7. Data Structure
8. Component Overview
9. Key Workflows
10. Getting Started
Project Overview
APHIA is a comprehensive French-language pharmacy management SaaS plat-
form designed for independent and chain pharmacies. It provides complete busi-
ness management capabilities including point-of-sale operations, inventory man-
agement, financial tracking, user management, and inter-pharmacy networking.
Key Specifications
• Language: French (Français)
• Theme: Premium Dark Theme
• Target Users: 10-50 pharmacies with 3-8 users per pharmacy
• Architecture: Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui
• Data: Fully mocked (no backend)
• Roles: 6 permission levels with real-time switching
Core Capabilities
• Complete point-of-sale system with IPM (Mutual Insurance) support
• Real-time inventory management with expiration tracking
• Comprehensive financial analytics and expense management
• Role-based access control for team management
• Complete audit trail for compliance
• Inter-pharmacy product network
• Configurable business settings

Navigation Hierarchy
Main Sidebar Navigation:
APHIA (Logo)
￿￿￿ ￿ Tableau de Bord → /dashboard
￿￿￿ ￿ Point de Vente → /pos
￿￿￿ ￿ Gestion Stock → /stock
￿￿￿ ￿ Finance → /finance
￿￿￿ ￿ Utilisateurs → /utilisateurs
￿￿￿ ￿ Journal d'Audit → /audit
￿￿￿ ￿ Réseau Inter-Pharmacies → /reseau
￿￿￿ ￿ Paramètres → /parametres
[Profile & Logout Section]
Features & Modules
1. Dashboard Module (/dashboard)
Purpose: Real-time business metrics and alerts overview
Key Performance Indicators:- CA du Jour - Today’s revenue (FCFA) -
Marge Réalisée - Profit margin percentage - Transactions - Number of sales
today - Créances IPM - Outstanding mutual insurance receivables - Alertes
Stock - Low stock warnings - Expirations 90j - Products expiring within 90
days
Visualizations:- Line Chart: 7-day revenue trend (Chiffre d’Affaires) - Pie
Chart: Sales breakdown (Comptant/Crédit/IPM) - Bar Chart: Top 5 best-
selling products - Alerts Panel: Critical stock and expiration notices
Role Access: All roles can view
4
2. Point of Sale Module (/pos)
Purpose: Complete checkout and sales management system
Key Features:- Product Search: Real-time filtering by DCI, forme, pack-
aging - Shopping Cart: Dynamic quantity management with price updates -
Sale Types: - Comptant (Cash) - Crédit (Credit) - IPM (Mutual Insurance) -
Pro-forma (Estimate)
IPM Calculation Engine: - Automatic split between patient and mutual
parts - Configurable mutual rates - Real-time calculation updates
Payment Processing: - Payment method selection (Cash, Card, Check) -
Change calculation - Validation workflow with confirmation dialog
Workflow: 1. Search and add products to cart 2. Adjust quantities as needed
3. Select sale type 4. For IPM: Select mutual and amount auto-calculates 5.
Enter payment method and amount 6. Click “Valider la Vente” 7. Confirmation
dialog with sale summary 8. On confirm: Stock decrements, sale recorded in
journal
Role Access: - TITULAIRE: Full access - ASSISTANT: Full access
- CAISSIER: Create sales only - STAGIAIRE: Draft sales only - SU-
PER_ADMIN: Read-only
3. Stock Management Module (/stock)
Purpose: Complete inventory tracking and management
Key Features:- Product Inventory Table: Displays all products with: -
DCI (International Nonproprietary Name) - Forme (Tablet, injection, etc.) -
Stock Quantity - Unit Price (FCFA) - Batch Information - Expiration Date -
Supplier
• Batch Reception: Modal form to:
– Add new product batches
– Set quantity, lot number, expiration date
– Update supplier information
• Stock Movements Log: Chronological history of:
– POS sales (decrements)
– Batch receipts (increments)
– Manual adjustments
– User who performed action
– Timestamp
• Expiration Alerts:
– 90-day expiration warning view
– Red badges on products expiring soon
– Alert count in sidebar
5
• Inventory Comparison: View stock discrepancies
Role Access: - TITULAIRE: Full access - ASSISTANT: Full access -
CAISSIER: View salle-vente stock only - STAGIAIRE: No access - SU-
PER_ADMIN: Cross-pharmacy view
4. Finance Module (/finance)
Purpose: Comprehensive financial analytics and expense management
Key Features:- Financial Dashboard: 6 KPI cards - Chiffre d’Affaires
(Total Revenue) - Coût des Marchandises (COGS) - Marge Brute (Gross Margin)
- Charges Opérationnelles (Operating Expenses) - Résultat Net (Net Result) -
Créances IPM (Receivables)
• Financial Chart: 6-month stacked bar chart showing:
– Revenue (green)
– COGS (red)
– Operating expenses (gray)
– Profit (blue)
• Expense Management:
– Table with status workflow: Brouillon → Validé → Payé
– Color-coded badges per status
– Create new expense form
– Edit expenses in Brouillon status
– Delete expenses in Brouillon status
– Validate expenses (TITULAIRE only)
– Mark as paid (TITULAIRE only)
• Expense Categories:
– Fournitures Médicales
– Équipement
– Personnel
– Loyer
– Électricité
– Autre
• IPM Receivables Table:
– Mutual claims tracking
– Outstanding amounts
– Due dates
– Payment status
• Journal Comptable (Accounting Journal):
– Immutable financial record
– All transactions logged
– Timestamp and user tracking
– Export capability
6
Expense Workflow: 1. Click “Nouvelle Dépense” 2. Fill form: category,
amount, date, description 3. Submit → Creates as Brouillon (draft) 4.
Edit/Delete while in Brouillon 5. Click “Valider” → Confirmation dialog 6.
Status changes to Validé (blue) 7. TITULAIRE clicks “Payer” 8. Status
changes to Payé (green, immutable)
Role Access: - TITULAIRE: Full access (create, validate, pay) - ASSISTANT:
Create and view only - CAISSIER: View financials only - STAGIAIRE: No
access - SUPER_ADMIN: Cross-pharmacy view
5. User Management Module (/utilisateurs)
Purpose: Team member management and role assignment
Key Features:- Users Table: Display of all team members with: -
Avatar/Initials - Full Name - Role (with color-coded badge) - Status (Ac-
tive/Inactive) - Last Login timestamp - Department
• User Creation: Modal form to:
– Add full name
– Assign role
– Set department
– Assign permissions
• User Modification:
– Change role (TITULAIRE only)
– Toggle active/inactive status
– Edit profile information
• User Deactivation:
– Soft delete (user kept in database)
– Inactive users can be reactivated
– Audit trail preserved
Roles Available: 1. TITULAIRE - Owner/Manager (Green) - Full system
access - Manage users and permissions - Validate expenses - Configure settings
2. ASSISTANT - Administrator (Blue)
• Most features except user/settings management
• Can create and validate expenses
• Cannot modify users
3. CAISSIER - Cashier (Orange)
• POS access
• Limited stock view (salle-vente only)
• View-only finance
• No admin functions
4. STAGIAIRE - Intern/Trainee (Gray)
• POS draft mode only
• Cannot complete sales
7
• Training access
5. SUPER_ADMIN - Super Administrator (Purple)
• Read-only access across all pharmacies
• Cross-pharmacy analytics
• System monitoring
Role Access: - TITULAIRE: Full CRUD operations - ASSISTANT: View only
- CAISSIER: No access - STAGIAIRE: No access - SUPER_ADMIN: Cross-
pharmacy view
6. Audit Trail Module (/audit)
Purpose: Complete activity logging for compliance and security
Key Features:- Audit Log Table: Chronological display of all actions
with: - Timestamp (date & time) - User (with avatar) - Action Type (badge-
colored) - Module/Entity affected - Before/After data comparison - IP Address
(simulated)
• Action Types:
– CREATE - New record (green badge)
– UPDATE - Modified record (blue badge)
– DELETE - Removed record (red badge)
– VALIDATE - Workflow change (gold badge)
– LOGIN - User authentication (purple badge)
– EXPORT - Data export (gray badge)
• Advanced Filtering:
– By User (dropdown)
– By Action Type (multi-select)
– By Date Range (date picker)
– By Module (POS, Stock, Finance, etc.)
– By Entity (specific record)
• Data Comparison View:
– Expandable row detail
– Before state (original values)
– After state (new values)
– Field-by-field changes highlighted
– Change tracking for sensitive data
Sample Entries: - “Dr. Amadou created expense: Transport (5000 FCFA)” -
“Marie validated expense: Fournitures (25000 FCFA)” - “System updated stock:
Paracétamol -10 units” - “User login: Dr. Amadou (192.168.1.1)”
Role Access: - TITULAIRE: Full access with all user’s actions visible - AS-
SISTANT: Full access with all user’s actions visible - CAISSIER: No access -
STAGIAIRE: No access - SUPER_ADMIN: Cross-pharmacy audit view
8
7. Inter-Pharmacy Network Module (/reseau)
Purpose: Connect with partner pharmacies for product availability
Key Features:- Product Search: Real-time search across network - Search
by DCI, forme, brand - Auto-complete suggestions - Instant results
• Results Display: Cards showing:
– Partner pharmacy name
– Location (Quartier)
– Product availability status (Disponible/Non disponible)
– Quantity available (generic: “Disponible” only, no exact quantity)
– Unit price (FCFA)
– Batch information
– Expiration date
– Contact button (call/message)
• Network Settings:
– Opt-in toggle to appear in other pharmacies’ networks (TITULAIRE
only)
– Privacy controls
– Product visibility preferences
• Partner Directory:
– List of connected pharmacies
– Contact information
– Operating status
– Average response time
Privacy Notes: - Never display exact stock quantities (only “Disponible” or
“Non disponible”) - Show estimated availability only - Hide internal pricing
(show only negotiated rates) - No supplier information shared
Role Access: All roles can search - TITULAIRE: Search + configure network -
ASSISTANT: Search only - CAISSIER: Search only - STAGIAIRE: Search only
- SUPER_ADMIN: Cross-network view
8. Settings/Configuration Module (/parametres)
Purpose: Business configuration and preferences
Key Features:
Pharmacy Information Section: - Pharmacy name - Address (street, city,
code postal) - Operating hours - Contact phone number - License number -
Owner name
9
POS Configuration: - Maximum discount percentage (%) - Rounding rules
(nearest franc) - Receipt format options - Payment timeout (seconds) - Printer
configuration
IPM/Mutual Management: - List of configured mutuals - Mutual rate per-
centages - Coverage limits - Contact persons - Settlement schedules
Supplier Management: - Supplier list with: - Company name - Contact
person - Phone number - Email - Payment terms - Lead time days - Default
delivery location - Add/Edit/Delete suppliers
Backup & System: - Last backup timestamp - Backup frequency selection -
Manual backup button - Data export options - System status indicators
Network Settings: - Opt-in to inter-pharmacy network - Display preferences
- Notification settings
Role Access: - TITULAIRE: Full configuration access - ASSISTANT: View
only - CAISSIER: No access - STAGIAIRE: No access - SUPER_ADMIN: Read-
only cross-pharmacy view
