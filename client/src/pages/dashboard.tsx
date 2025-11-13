import { MetricCard } from "@/components/metric-card";
import { SalesChart } from "@/components/sales-chart";
import { ExpenseChart } from "@/components/expense-chart";
import { DollarSign, TrendingDown, Package, Wallet, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useAppContext } from "@/context/AppContext";
import { Link } from "wouter";
import { useMemo } from "react";

export default function Dashboard() {
  const { invoices, products, purchaseOrders } = useAppContext();

  const metrics = useMemo(() => {
    const totalSales = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = purchaseOrders.filter(po => po.status === "received").reduce((sum, po) => sum + po.total, 0);
    const stockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const cashFlow = totalSales - totalExpenses;

    return { totalSales, totalExpenses, stockValue, cashFlow };
  }, [invoices, products, purchaseOrders]);

  const recentInvoices = useMemo(() => 
    invoices.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [invoices]
  );

  const lowStockItems = useMemo(() => 
    products.filter(p => p.stock < p.threshold).slice(0, 3),
    [products]
  );

  const salesData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: invoices
        .filter(inv => inv.date === date && inv.status === "paid")
        .reduce((sum, inv) => sum + inv.total, 0),
    }));
  }, [invoices]);

  const expenseData = useMemo(() => {
    const categories = ['Inventory', 'Salaries', 'Utilities', 'Marketing', 'Others'];
    const totalExpenses = purchaseOrders.filter(po => po.status === "received").reduce((sum, po) => sum + po.total, 0);
    
    return categories.map((name, i) => ({
      name,
      value: totalExpenses > 0 ? Math.round(totalExpenses * (0.4 - i * 0.08)) : 0,
    }));
  }, [purchaseOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value={`₹${metrics.totalSales.toLocaleString()}`}
          icon={DollarSign}
          className="stagger-delay-1"
        />
        <MetricCard
          title="Total Expenses"
          value={`₹${metrics.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          className="stagger-delay-2"
        />
        <MetricCard
          title="Stock Value"
          value={`₹${metrics.stockValue.toLocaleString()}`}
          icon={Package}
          className="stagger-delay-3"
        />
        <MetricCard
          title="Cash Flow"
          value={`₹${metrics.cashFlow.toLocaleString()}`}
          icon={Wallet}
          className="stagger-delay-4"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="animate-fadeInUp stagger-delay-1">
          <SalesChart data={salesData} />
        </div>
        <div className="animate-fadeInUp stagger-delay-2">
          <ExpenseChart data={expenseData} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
            <Link href="/invoices">
              <Button variant="outline" size="sm" data-testid="button-view-all-invoices">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No invoices yet. Create your first invoice to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between gap-4 p-3 rounded-md hover-elevate hover-lift transition-smooth border">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm" data-testid={`invoice-${invoice.id}`}>{invoice.invoiceNumber}</div>
                        <div className="text-sm text-muted-foreground truncate">{invoice.customerName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-medium text-sm">₹{invoice.total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{invoice.date}</div>
                      </div>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                All products are well stocked.
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-md hover-elevate border border-warning/20 bg-warning/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <Package className="h-4 w-4 text-warning flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm" data-testid={`low-stock-${index}`}>{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Threshold: {item.threshold} units
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono font-semibold text-warning">{item.stock}</div>
                      <div className="text-xs text-muted-foreground">in stock</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
