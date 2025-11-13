# Vyapar-Style Billing & Accounting Application Design Guidelines

## Design Approach
**System-Based Approach**: Business accounting application with Material Design principles, inspired by Vyapar and Zoho Books. Focus on clarity, efficiency, and data density with professional aesthetics.

---

## Typography

**Primary Font**: Inter or Roboto (via Google Fonts CDN)
**Secondary Font**: Roboto Mono (for numbers, invoices, financial data)

**Hierarchy**:
- Page Titles: 2xl font size, semibold weight
- Section Headers: xl font size, medium weight  
- Card Titles: lg font size, medium weight
- Body Text: base font size, regular weight
- Table Data: sm font size, regular weight
- Financial Numbers: lg font size, Roboto Mono, medium weight
- Small Labels/Metadata: xs font size, medium weight

---

## Layout System

**Spacing Units**: Use Tailwind spacing of 2, 4, 6, 8, 12, and 16 for consistency
- Component padding: p-4 to p-6
- Card spacing: p-6
- Section gaps: gap-6 to gap-8
- Page margins: mx-4 to mx-8

**Grid System**:
- Dashboard metrics: 4-column grid (lg:grid-cols-4, md:grid-cols-2, grid-cols-1)
- Tables: Full-width with horizontal scroll on mobile
- Forms: 2-column layout on desktop, single column on mobile
- Invoice items: Full-width table with sticky header

**Container Strategy**:
- Main content area: max-w-7xl with left sidebar offset
- Forms/Wizards: max-w-3xl centered
- Modals: max-w-2xl

---

## Navigation & Layout Structure

**Sidebar Navigation** (Desktop):
- Fixed left sidebar, width 16 (256px)
- Collapsible to icon-only view (width 20/80px)
- Logo at top, navigation items grouped by category
- Active state: subtle background with accent border-left
- Icons from Lucide Icons or Heroicons

**Top Bar**:
- Fixed header with company name/logo, search, notifications bell, profile dropdown
- Height: h-16
- Right-aligned actions with spacing gap-4

**Mobile Navigation**:
- Hamburger menu triggering slide-in sidebar
- Bottom navigation bar for key actions (Dashboard, New Invoice, Reports, More)

---

## Component Library

### Cards & Containers
- Clean white backgrounds with subtle border (border-gray-200)
- Rounded corners: rounded-lg
- Shadow on hover: hover:shadow-md transition
- Metric cards: Large number display with label, icon in top-right

### Tables
- Striped rows with subtle gray backgrounds
- Sticky headers
- Sortable columns with arrow indicators
- Row hover state with light background
- Action buttons (View/Edit/Delete) in last column with icon buttons
- Pagination at bottom-right

### Forms
- Input fields: border with focus ring, rounded-md
- Labels above inputs, medium weight, text-sm
- Required field indicator (asterisk in red)
- Inline validation messages below fields
- Multi-step forms with progress indicator at top

### Buttons
- Primary: Solid background, white text, rounded-md
- Secondary: Border with transparent background
- Sizes: sm (h-8), base (h-10), lg (h-12)
- Icon buttons: Square with icon centered
- Floating action button (mobile): Fixed bottom-right, circular

### Modals & Dialogs
- Overlay with backdrop blur
- Centered modal with max-w-2xl
- Header with title and close button
- Footer with Cancel/Confirm actions aligned right

### Status Badges
- Pill-shaped with rounded-full
- Color-coded: Draft (gray), Sent (blue), Paid (green), Overdue (red)
- Small text with px-3 py-1

### Charts & Graphs
- Use Recharts library
- Minimalist styling with grid lines
- Tooltip on hover showing exact values
- Legend positioned at top-right
- Color scheme matching overall palette

---

## Special Components

### Invoice Builder
- Three-column layout: Customer selection, Item addition, Preview/Summary
- Live calculation of totals with tax breakdown visible
- Sticky summary sidebar on desktop

### Inventory Grid
- Card-based product display with image, name, SKU, stock count
- Low-stock warning badge (red dot or border)
- Quick action buttons on card hover

### Bank Reconciliation
- Split-screen: Bank transactions (left) vs Book entries (right)
- Drag-to-match interaction or click-to-match buttons
- Matched items move to "Reconciled" section below

### Dashboard KPI Cards
- Large number prominently displayed
- Comparison indicator (up/down arrow with percentage)
- Mini sparkline chart showing trend
- Icon representing metric type

---

## Responsive Behavior

**Desktop (lg+)**: Full sidebar, multi-column grids, expanded tables
**Tablet (md)**: Collapsible sidebar, 2-column grids, scrollable tables
**Mobile (base)**: Hidden sidebar (hamburger), single column, card-based lists, bottom navigation

**Breakpoint Strategy**:
- Critical actions always visible
- Tables convert to card views on mobile
- Forms stack vertically
- Charts resize gracefully with responsive containers

---

## Interaction Patterns

**Minimize Animations**: Business users value speed over flourish
- Subtle transitions for hover states (150ms)
- Smooth sidebar collapse/expand
- Modal fade-in/out
- NO loading spinners for local data operations

**Keyboard Navigation**:
- Tab order follows logical flow
- Shortcuts for common actions (Ctrl+I for new invoice)
- Escape to close modals
- Enter to submit forms

---

## Data Visualization

**Dashboard Charts**:
- Sales Trend: Line chart, 7-day or monthly view
- Expense Breakdown: Donut chart with category labels
- Cash Flow: Bar chart comparing income vs expenses

**Report Tables**:
- Exportable (PDF/Excel buttons in header)
- Column totals in footer row
- Filterable by date range with calendar picker

---

## Accessibility

- Semantic HTML throughout
- ARIA labels for icon buttons
- Focus indicators on all interactive elements
- Sufficient color contrast (WCAG AA minimum)
- Screen reader friendly table headers
- Keyboard accessible dropdowns and modals

---

## Images

**No hero images** - This is a business application focused on functionality over marketing appeal. All visual interest comes from clean layout, data visualization, and thoughtful use of whitespace.

**Product/Company Logos**: Placeholder circles or squares with initials when no image uploaded, accept common formats (PNG, JPG), display at 48x48 to 64x64 in most contexts