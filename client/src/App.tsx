import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AppProvider } from "@/context/AppContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useEffect } from "react";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import CompanySetup from "@/pages/company-setup";
import Dashboard from "@/pages/dashboard";
import Invoices from "@/pages/invoices";
import Customers from "@/pages/customers";
import Parties from "@/pages/parties";
import Inventory from "@/pages/inventory";
import PurchaseOrders from "@/pages/purchase-orders";
import BankReconciliation from "@/pages/bank-reconciliation";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import MobileInvoiceFlow from "@/pages/mobile-invoice-flow";
import AccountantPortal from "@/pages/accountant-portal";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const companyData = localStorage.getItem("companyData");

    if (!loggedInUser && location !== "/login") {
      setLocation("/login");
    } else if (loggedInUser && !companyData && location !== "/setup") {
      setLocation("/setup");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/login" component={AuthPage} />
      <Route path="/setup" component={CompanySetup} />
      <Route path="/" component={Dashboard} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/mobile-invoice" component={MobileInvoiceFlow} />
      <Route path="/accountant-portal" component={AccountantPortal} />
      <Route path="/customers" component={Customers} />
      <Route path="/parties" component={Parties} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/bank-reconciliation" component={BankReconciliation} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAuthPage = location === "/login" || location === "/setup";

  if (isAuthPage) {
    return <Router />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <ThemeToggle />
              <ProfileDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="page-transition">
              <Router />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <AppLayout />
            <Toaster />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
