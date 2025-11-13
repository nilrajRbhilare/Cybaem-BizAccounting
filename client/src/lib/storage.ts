// LocalStorage helper utilities for data persistence

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  totalInvoices: number;
  totalAmount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  price: number;
  unit: string;
  description?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  date: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  status: "pending" | "received" | "cancelled";
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  matched: boolean;
  matchedWith?: string;
}

export interface BookEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  matched: boolean;
  matchedWith?: string;
  invoiceId?: string;
  poId?: string;
}

export interface AppSettings {
  companyName: string;
  gstNumber: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  enableNotifications: boolean;
  userProfile: {
    name: string;
    email: string;
    phone: string;
  };
}

// Initialize default data
const defaultSettings: AppSettings = {
  companyName: "",
  gstNumber: "",
  address: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  currency: "INR",
  taxRate: 18,
  invoicePrefix: "INV",
  enableNotifications: true,
  userProfile: {
    name: "Admin User",
    email: "admin@business.com",
    phone: "+91 98765 43210",
  },
};

// Storage keys
const KEYS = {
  CUSTOMERS: "biz_customers",
  PRODUCTS: "biz_products",
  INVOICES: "biz_invoices",
  PURCHASE_ORDERS: "biz_purchase_orders",
  BANK_TRANSACTIONS: "biz_bank_transactions",
  BOOK_ENTRIES: "biz_book_entries",
  SETTINGS: "biz_settings",
  USER: "loggedInUser",
  COMPANY_DATA: "companyData",
};

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// Customer operations
export const customerStorage = {
  getAll: (): Customer[] => getFromStorage(KEYS.CUSTOMERS, []),
  save: (customers: Customer[]) => saveToStorage(KEYS.CUSTOMERS, customers),
  add: (customer: Omit<Customer, "id" | "totalInvoices" | "totalAmount">): Customer => {
    const customers = customerStorage.getAll();
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${Date.now()}`,
      totalInvoices: 0,
      totalAmount: 0,
    };
    customers.push(newCustomer);
    customerStorage.save(customers);
    return newCustomer;
  },
  update: (id: string, updates: Partial<Customer>): Customer | null => {
    const customers = customerStorage.getAll();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    customers[index] = { ...customers[index], ...updates };
    customerStorage.save(customers);
    return customers[index];
  },
  delete: (id: string): boolean => {
    const customers = customerStorage.getAll();
    const filtered = customers.filter((c) => c.id !== id);
    if (filtered.length === customers.length) return false;
    customerStorage.save(filtered);
    return true;
  },
  getById: (id: string): Customer | null => {
    const customers = customerStorage.getAll();
    return customers.find((c) => c.id === id) || null;
  },
};

// Product operations
export const productStorage = {
  getAll: (): Product[] => getFromStorage(KEYS.PRODUCTS, []),
  save: (products: Product[]) => saveToStorage(KEYS.PRODUCTS, products),
  add: (product: Omit<Product, "id">): Product => {
    const products = productStorage.getAll();
    const newProduct: Product = {
      ...product,
      id: `PROD-${Date.now()}`,
    };
    products.push(newProduct);
    productStorage.save(products);
    return newProduct;
  },
  update: (id: string, updates: Partial<Product>): Product | null => {
    const products = productStorage.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    productStorage.save(products);
    return products[index];
  },
  delete: (id: string): boolean => {
    const products = productStorage.getAll();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    productStorage.save(filtered);
    return true;
  },
  getById: (id: string): Product | null => {
    const products = productStorage.getAll();
    return products.find((p) => p.id === id) || null;
  },
  updateStock: (id: string, quantity: number): Product | null => {
    const products = productStorage.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index].stock += quantity;
    productStorage.save(products);
    return products[index];
  },
  getLowStock: (): Product[] => {
    const products = productStorage.getAll();
    return products.filter((p) => p.stock < p.threshold);
  },
};

// Invoice operations
export const invoiceStorage = {
  getAll: (): Invoice[] => getFromStorage(KEYS.INVOICES, []),
  save: (invoices: Invoice[]) => saveToStorage(KEYS.INVOICES, invoices),
  add: (invoice: Omit<Invoice, "id" | "invoiceNumber">): Invoice => {
    const invoices = invoiceStorage.getAll();
    const settings = settingsStorage.get();
    const count = invoices.length + 1;
    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${Date.now()}`,
      invoiceNumber: `${settings.invoicePrefix}-${count.toString().padStart(4, "0")}`,
    };
    invoices.push(newInvoice);
    invoiceStorage.save(invoices);
    
    // Update customer total
    const customer = customerStorage.getById(invoice.customerId);
    if (customer) {
      customerStorage.update(customer.id, {
        totalInvoices: customer.totalInvoices + 1,
        totalAmount: customer.totalAmount + invoice.total,
      });
    }
    
    // Update product stock
    invoice.items.forEach((item) => {
      productStorage.updateStock(item.productId, -item.quantity);
    });
    
    return newInvoice;
  },
  update: (id: string, updates: Partial<Invoice>): Invoice | null => {
    const invoices = invoiceStorage.getAll();
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) return null;
    invoices[index] = { ...invoices[index], ...updates };
    invoiceStorage.save(invoices);
    return invoices[index];
  },
  delete: (id: string): boolean => {
    const invoices = invoiceStorage.getAll();
    const filtered = invoices.filter((inv) => inv.id !== id);
    if (filtered.length === invoices.length) return false;
    invoiceStorage.save(filtered);
    return true;
  },
  getById: (id: string): Invoice | null => {
    const invoices = invoiceStorage.getAll();
    return invoices.find((inv) => inv.id === id) || null;
  },
};

// Purchase Order operations
export const purchaseOrderStorage = {
  getAll: (): PurchaseOrder[] => getFromStorage(KEYS.PURCHASE_ORDERS, []),
  save: (pos: PurchaseOrder[]) => saveToStorage(KEYS.PURCHASE_ORDERS, pos),
  add: (po: Omit<PurchaseOrder, "id" | "poNumber">): PurchaseOrder => {
    const pos = purchaseOrderStorage.getAll();
    const count = pos.length + 1;
    const newPO: PurchaseOrder = {
      ...po,
      id: `PO-${Date.now()}`,
      poNumber: `PO-${(1000 + count).toString()}`,
    };
    pos.push(newPO);
    purchaseOrderStorage.save(pos);
    return newPO;
  },
  update: (id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | null => {
    const pos = purchaseOrderStorage.getAll();
    const index = pos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    pos[index] = { ...pos[index], ...updates };
    purchaseOrderStorage.save(pos);
    return pos[index];
  },
  receiveStock: (id: string): PurchaseOrder | null => {
    const po = purchaseOrderStorage.getAll().find((p) => p.id === id);
    if (!po) return null;
    
    // Update product stock
    po.items.forEach((item) => {
      productStorage.updateStock(item.productId, item.quantity);
    });
    
    return purchaseOrderStorage.update(id, { status: "received" });
  },
};

// Bank reconciliation operations
export const bankStorage = {
  getTransactions: (): BankTransaction[] => getFromStorage(KEYS.BANK_TRANSACTIONS, []),
  saveTransactions: (txns: BankTransaction[]) => saveToStorage(KEYS.BANK_TRANSACTIONS, txns),
  getEntries: (): BookEntry[] => getFromStorage(KEYS.BOOK_ENTRIES, []),
  saveEntries: (entries: BookEntry[]) => saveToStorage(KEYS.BOOK_ENTRIES, entries),
  matchTransaction: (bankId: string, bookId: string): boolean => {
    const txns = bankStorage.getTransactions();
    const entries = bankStorage.getEntries();
    
    const txnIndex = txns.findIndex((t) => t.id === bankId);
    const entryIndex = entries.findIndex((e) => e.id === bookId);
    
    if (txnIndex === -1 || entryIndex === -1) return false;
    
    txns[txnIndex].matched = true;
    txns[txnIndex].matchedWith = bookId;
    entries[entryIndex].matched = true;
    entries[entryIndex].matchedWith = bankId;
    
    bankStorage.saveTransactions(txns);
    bankStorage.saveEntries(entries);
    return true;
  },
};

// Settings operations
export const settingsStorage = {
  get: (): AppSettings => {
    const stored = getFromStorage(KEYS.SETTINGS, defaultSettings);
    return { ...defaultSettings, ...stored };
  },
  save: (settings: Partial<AppSettings>) => {
    const current = settingsStorage.get();
    const updated = { ...current, ...settings };
    saveToStorage(KEYS.SETTINGS, updated);
  },
  reset: () => saveToStorage(KEYS.SETTINGS, defaultSettings),
};

// Calculation utilities
export function calculateInvoiceTotal(
  items: InvoiceItem[],
  taxRate: number = 18
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function generateInvoiceNumber(prefix: string, count: number): string {
  return `${prefix}-${count.toString().padStart(4, "0")}`;
}

// Initialize sample data on first load
export function initializeSampleData() {
  if (customerStorage.getAll().length === 0) {
    const sampleCustomers: Omit<Customer, "id">[] = [
      {
        name: "Tech Solutions Ltd",
        email: "contact@techsolutions.com",
        phone: "+91 98765 43210",
        address: "123 Tech Park, Bangalore",
        gstNumber: "29ABCDE1234F1Z5",
        totalInvoices: 0,
        totalAmount: 0,
      },
      {
        name: "Global Traders",
        email: "info@globaltraders.com",
        phone: "+91 98765 43211",
        address: "456 Trade Center, Mumbai",
        gstNumber: "27FGHIJ5678K2Y4",
        totalInvoices: 0,
        totalAmount: 0,
      },
    ];
    sampleCustomers.forEach((c) => customerStorage.add(c));
  }

  if (productStorage.getAll().length === 0) {
    const sampleProducts: Omit<Product, "id">[] = [
      {
        sku: "OFF-CHR-001",
        name: "Office Chair",
        category: "Furniture",
        stock: 15,
        threshold: 10,
        price: 5500,
        unit: "pcs",
        description: "Ergonomic office chair with lumbar support",
      },
      {
        sku: "STA-PEN-002",
        name: "Premium Pen Set",
        category: "Stationery",
        stock: 45,
        threshold: 20,
        price: 350,
        unit: "sets",
        description: "Set of 5 premium ballpoint pens",
      },
    ];
    sampleProducts.forEach((p) => productStorage.add(p));
  }

  if (bankStorage.getTransactions().length === 0) {
    const sampleTxns: BankTransaction[] = [
      {
        id: "B1",
        date: "2024-01-15",
        description: "Tech Solutions Ltd",
        amount: 45000,
        type: "credit",
        matched: false,
      },
      {
        id: "B2",
        date: "2024-01-16",
        description: "Office Supplies Purchase",
        amount: 8500,
        type: "debit",
        matched: false,
      },
    ];
    bankStorage.saveTransactions(sampleTxns);

    const sampleEntries: BookEntry[] = [
      {
        id: "BE1",
        date: "2024-01-15",
        description: "Invoice Payment",
        amount: 45000,
        type: "income",
        matched: false,
      },
      {
        id: "BE2",
        date: "2024-01-16",
        description: "Purchase Order",
        amount: 8500,
        type: "expense",
        matched: false,
      },
    ];
    bankStorage.saveEntries(sampleEntries);
  }
}
