# Vyapar-Style Billing & Accounting Application

## Overview
A comprehensive billing and accounting web application built with React 18, inspired by Vyapar and Zoho Books. The application provides complete business management capabilities including invoicing, inventory tracking, customer management, purchase orders, bank reconciliation, and financial reporting.

## Recent Changes (November 5, 2025)
- **Data Management Layer**: Implemented complete localStorage-based data persistence system
- **State Management**: Created AppContext for centralized state management across all entities
- **Dialog Components**: Built reusable modal dialogs for all CRUD operations
- **Real Functionality**: Updated all pages to use real data with calculations, filtering, and status updates
- **Components**: Created CustomerDialog, ProductDialog, InvoiceDialog, PurchaseOrderDialog, ConfirmDialog
- **Business Logic**: Implemented GST calculations, stock management, invoice totals, and purchase order processing

## Project Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context API
- **Data Persistence**: localStorage only (no backend/server)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Key Design Decisions
- **No Backend**: All data stored in localStorage - easy to deploy and use
- **Material Design**: Inspired by Vyapar and Zoho Books for familiar UX
- **Context API**: Simple state management without Redux complexity
- **Responsive**: Mobile-first design with desktop optimizations
- **Accessibility**: Keyboard navigation and ARIA labels throughout

## Application Structure

### Core Files
- `client/src/context/AppContext.tsx` - Centralized state management for all entities
- `client/src/lib/storage.ts` - localStorage abstraction layer with CRUD operations
- `client/src/lib/types.ts` - TypeScript type definitions for all data models
- `design_guidelines.md` - UI/UX design specifications and color scheme

### Pages
1. **Dashboard** (`/`) - Business overview with metrics, charts, and quick actions
2. **Invoices** (`/invoices`) - Create, manage, and track invoices with GST calculations
3. **Customers** (`/customers`) - Customer directory with contact information
4. **Inventory** (`/inventory`) - Product catalog with stock tracking and alerts
5. **Purchase Orders** (`/purchase-orders`) - Vendor orders with stock receiving
6. **Bank Reconciliation** (`/bank-reconciliation`) - Match bank and book entries
7. **Reports** (`/reports`) - Profit & Loss, Balance Sheet, GST Summary
8. **Settings** (`/settings`) - User profile, company info, and preferences

### Authentication Flow
1. Login/Signup (`/login`) - User authentication (localStorage-based)
2. Company Setup (`/setup`) - First-time company information wizard
3. Main Application - Access after authentication and setup

## Data Models

### Customer
- Basic info: name, email, phone, address, GST number
- Computed fields: totalInvoices, totalAmount

### Product
- Details: name, SKU, category, unit, price
- Stock: current stock, threshold for alerts

### Invoice
- Customer reference, date, status (draft/sent/paid/overdue)
- Line items with product, quantity, rate
- Auto-calculated: subtotal, tax (GST), total

### Purchase Order
- Vendor info, date, status (pending/received)
- Line items with product and quantities
- Stock receiving updates inventory

### Bank Transaction & Book Entry
- For bank reconciliation feature
- Matching system for financial accuracy

### Settings
- User profile information
- Company details (name, GST, address)
- Business preferences (currency, tax rate, invoice prefix)
- Notification settings

## Key Features

### 1. Invoice Management
- Create invoices with multiple line items
- Automatic GST calculation (CGST + SGST)
- Status tracking (draft → sent → paid/overdue)
- Filter by status and search by customer/invoice number
- PDF download capability (UI ready)

### 2. Customer Directory
- Add/edit/delete customers
- Track total invoices and revenue per customer
- Search and filter capabilities
- Avatar initials for visual identification

### 3. Inventory Tracking
- Product catalog with SKU management
- Real-time stock level tracking
- Low stock alerts (threshold-based)
- Category-based filtering
- Stock value calculations

### 4. Purchase Order Processing
- Create POs for vendor orders
- Receive stock functionality
- Automatic inventory updates on receiving
- Status tracking (pending → received)

### 5. Bank Reconciliation
- Import bank transactions
- Match with book entries
- Visual matching interface
- Reconciliation status tracking

### 6. Financial Reporting
- Profit & Loss statement
- GST Summary by month
- Balance Sheet (UI ready)
- Export capabilities (UI ready)

### 7. Dashboard Analytics
- Real-time business metrics
- Sales and expense charts
- Recent invoice tracking
- Low stock alerts

## User Preferences
- **Data Storage**: localStorage only (no backend server)
- **Design**: Material Design inspired by Vyapar/Zoho Books
- **Responsiveness**: Full mobile and desktop support required
- **Accessibility**: Keyboard navigation and ARIA support throughout

## Development Notes

### Mock Data
- Initial sample data created for demonstration
- Marked with `//todo: remove mock functionality` comments
- Easily removable for production use

### Testing Requirements
- All interactive elements have `data-testid` attributes
- CTA_AUDIT.md tracks all clickable elements and their functionality
- Comprehensive testing needed for all CRUD operations

### Known Limitations
- No real authentication backend (uses localStorage)
- No email/SMS notifications (placeholder functionality)
- PDF generation is UI-only (needs implementation)
- No actual bank API integration

## Next Steps
- Remove mock data and functionality
- Add PDF generation for invoices
- Implement email/SMS notification system
- Add data export/import capabilities
- Create user onboarding tutorials
- Add more chart visualizations
- Implement advanced filtering and sorting
- Add recurring invoice support

## Technical Debt
- None currently - fresh implementation
- Follow established patterns for new features
- Maintain type safety with TypeScript
- Keep accessibility in mind for all new UI
