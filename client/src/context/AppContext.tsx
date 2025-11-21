import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Customer,
  Party,
  Product,
  Invoice,
  PurchaseOrder,
  BankTransaction,
  BookEntry,
  AppSettings,
  customerStorage,
  partyStorage,
  productStorage,
  invoiceStorage,
  purchaseOrderStorage,
  bankStorage,
  settingsStorage,
  initializeSampleData,
  InvoiceItem,
  calculateInvoiceTotal,
} from "@/lib/storage";

interface AppContextType {
  // Data
  customers: Customer[];
  parties: Party[];
  products: Product[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  bankTransactions: BankTransaction[];
  bookEntries: BookEntry[];
  settings: AppSettings;

  // Customer operations
  addCustomer: (customer: Omit<Customer, "id" | "totalInvoices" | "totalAmount">) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => Customer | null;
  deleteCustomer: (id: string) => boolean;

  // Party operations
  addParty: (party: Omit<Party, "id">) => Party;
  updateParty: (id: string, updates: Partial<Party>) => Party | null;
  deleteParty: (id: string) => boolean;
  getPartyById: (id: string) => Party | null;

  // Product operations
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => Product | null;
  deleteProduct: (id: string) => boolean;
  getLowStockProducts: () => Product[];

  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber">) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Invoice | null;
  deleteInvoice: (id: string) => boolean;

  // Purchase order operations
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "poNumber">) => PurchaseOrder;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => PurchaseOrder | null;
  deletePurchaseOrder: (id: string) => boolean;
  receiveStock: (id: string) => PurchaseOrder | null;

  // Bank reconciliation
  matchBankEntry: (bankId: string, bookId: string) => boolean;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Utility
  refreshData: () => void;
  getCustomerById: (id: string) => Customer | null;
  getProductById: (id: string) => Product | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [bookEntries, setBookEntries] = useState<BookEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(settingsStorage.get());

  // Load data from localStorage on mount
  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = () => {
    setCustomers(customerStorage.getAll());
    setParties(partyStorage.getAll());
    setProducts(productStorage.getAll());
    setInvoices(invoiceStorage.getAll());
    setPurchaseOrders(purchaseOrderStorage.getAll());
    setBankTransactions(bankStorage.getTransactions());
    setBookEntries(bankStorage.getEntries());
    setSettings(settingsStorage.get());
  };

  const refreshData = () => {
    loadData();
  };

  // Customer operations
  const addCustomer = (customer: Omit<Customer, "id" | "totalInvoices" | "totalAmount">) => {
    const newCustomer = customerStorage.add(customer);
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = customerStorage.update(id, updates);
    if (updated) {
      setCustomers(customers.map((c) => (c.id === id ? updated : c)));
    }
    return updated;
  };

  const deleteCustomer = (id: string) => {
    const success = customerStorage.delete(id);
    if (success) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
    return success;
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id) || null;
  };

  // Party operations
  const addParty = (party: Omit<Party, "id">) => {
    const newParty = partyStorage.add(party);
    setParties([...parties, newParty]);
    return newParty;
  };

  const updateParty = (id: string, updates: Partial<Party>) => {
    const updated = partyStorage.update(id, updates);
    if (updated) {
      setParties(parties.map((p) => (p.id === id ? updated : p)));
    }
    return updated;
  };

  const deleteParty = (id: string) => {
    const success = partyStorage.delete(id);
    if (success) {
      setParties(parties.filter((p) => p.id !== id));
    }
    return success;
  };

  const getPartyById = (id: string) => {
    return parties.find((p) => p.id === id) || null;
  };

  // Product operations
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = productStorage.add(product);
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = productStorage.update(id, updates);
    if (updated) {
      setProducts(products.map((p) => (p.id === id ? updated : p)));
    }
    return updated;
  };

  const deleteProduct = (id: string) => {
    const success = productStorage.delete(id);
    if (success) {
      setProducts(products.filter((p) => p.id !== id));
    }
    return success;
  };

  const getLowStockProducts = () => {
    return productStorage.getLowStock();
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id) || null;
  };

  // Invoice operations
  const addInvoice = (invoice: Omit<Invoice, "id" | "invoiceNumber">) => {
    const newInvoice = invoiceStorage.add(invoice);
    setInvoices([...invoices, newInvoice]);
    refreshData(); // Refresh to update customer totals and product stock
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const updated = invoiceStorage.update(id, updates);
    if (updated) {
      setInvoices(invoices.map((inv) => (inv.id === id ? updated : inv)));
      refreshData(); // Recalculate customer totals and other derived data
    }
    return updated;
  };

  const deleteInvoice = (id: string) => {
    const success = invoiceStorage.delete(id);
    if (success) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
      refreshData(); // Recalculate customer totals and other derived data
    }
    return success;
  };

  // Purchase order operations
  const addPurchaseOrder = (po: Omit<PurchaseOrder, "id" | "poNumber">) => {
    const newPO = purchaseOrderStorage.add(po);
    setPurchaseOrders([...purchaseOrders, newPO]);
    return newPO;
  };

  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
    const updated = purchaseOrderStorage.update(id, updates);
    if (updated) {
      setPurchaseOrders(purchaseOrders.map((po) => (po.id === id ? updated : po)));
      refreshData(); // Recalculate product stock and other derived data
    }
    return updated;
  };

  const deletePurchaseOrder = (id: string) => {
    const success = purchaseOrderStorage.delete(id);
    if (success) {
      setPurchaseOrders(purchaseOrders.filter((po) => po.id !== id));
      refreshData(); // Recalculate product stock and other derived data
    }
    return success;
  };

  const receiveStock = (id: string) => {
    const updated = purchaseOrderStorage.receiveStock(id);
    if (updated) {
      setPurchaseOrders(purchaseOrders.map((po) => (po.id === id ? updated : po)));
      refreshData(); // Refresh to update product stock
    }
    return updated;
  };

  // Bank reconciliation
  const matchBankEntry = (bankId: string, bookId: string) => {
    const success = bankStorage.matchTransaction(bankId, bookId);
    if (success) {
      setBankTransactions(bankStorage.getTransactions());
      setBookEntries(bankStorage.getEntries());
    }
    return success;
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settingsStorage.save(newSettings);
    setSettings(settingsStorage.get());
  };

  const value: AppContextType = {
    customers,
    parties,
    products,
    invoices,
    purchaseOrders,
    bankTransactions,
    bookEntries,
    settings,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addParty,
    updateParty,
    deleteParty,
    getPartyById,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    receiveStock,
    matchBankEntry,
    updateSettings,
    refreshData,
    getCustomerById,
    getProductById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Hook for calculating invoice totals based on current settings
export function useInvoiceCalculation() {
  const { settings } = useAppContext();

  return {
    calculateTotals: (items: InvoiceItem[]) =>
      calculateInvoiceTotal(items, settings.taxRate),
    taxRate: settings.taxRate,
  };
}
