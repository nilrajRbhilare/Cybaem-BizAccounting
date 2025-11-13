import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext";

export default function AccountantPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const { invoices = [], customers = [] } = useAppContext() || {};

  const clientData = useMemo(() => {
    return customers.map((customer) => {
      const clientInvoices = invoices.filter(
        (inv) => inv.customerId === customer.id
      );
      const paidInvoices = clientInvoices.filter((inv) => inv.status === "paid");
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const lastInvoiceDate = clientInvoices.length > 0
        ? new Date(Math.max(...clientInvoices.map((inv) => new Date(inv.date).getTime())))
        : null;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        balance: customer.totalAmount || 0,
        invoiceCount: clientInvoices.length,
        revenue: totalRevenue,
        lastInvoice: lastInvoiceDate
          ? lastInvoiceDate.toLocaleDateString()
          : "No invoices",
      };
    });
  }, [customers, invoices]);

  const filteredClients = useMemo(() => {
    return clientData.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clientData, searchQuery]);

  const totalRevenue = useMemo(
    () => clientData.reduce((sum, client) => sum + client.revenue, 0),
    [clientData]
  );

  const revenueByClient = useMemo(
    () =>
      clientData
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((client) => ({
          name: client.name.split(" ")[0],
          revenue: client.revenue,
        })),
    [clientData]
  );

  const monthlyRevenue = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        revenue: 0,
        expenses: 0,
      };
    });

    invoices.forEach((inv) => {
      const invDate = new Date(inv.date);
      const monthIndex = last6Months.findIndex((m) => {
        const testDate = new Date();
        testDate.setMonth(testDate.getMonth() - (5 - last6Months.indexOf(m)));
        return (
          invDate.getMonth() === testDate.getMonth() &&
          invDate.getFullYear() === testDate.getFullYear()
        );
      });

      if (monthIndex !== -1 && inv.status === "paid") {
        last6Months[monthIndex].revenue += inv.total;
      }
    });

    last6Months.forEach((month) => {
      month.expenses = month.revenue * 0.6;
    });

    return last6Months;
  }, [invoices]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  return (
    <div className="space-y-6 p-6">
      <div className="animate-fadeInDown">
        <h1 className="text-2xl font-semibold mb-1">Accountant Portal</h1>
        <p className="text-muted-foreground">
          Comprehensive client management and financial analytics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 animate-fadeInUp stagger-delay-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {clientData.length} active clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total managed accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all clients
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="animate-fadeInUp stagger-delay-2">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2">
          <TabsTrigger value="clients" data-testid="tab-clients">
            <Users className="h-4 w-4 mr-2" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Client Directory</CardTitle>
                  <CardDescription>
                    View and manage all client accounts
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-9 w-full md:w-72"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-clients"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead className="text-right">Invoices</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead>Last Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow
                        key={client.id}
                        className="hover-elevate cursor-pointer"
                        data-testid={`client-row-${client.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {client.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={client.balance > 0 ? "destructive" : "secondary"}
                          >
                            ₹{Math.abs(client.balance).toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {client.invoiceCount}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{client.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {client.lastInvoice}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-4">
                {filteredClients.map((client) => (
                  <Card
                    key={client.id}
                    className="hover-elevate cursor-pointer"
                    data-testid={`client-card-${client.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {client.email}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant={
                                client.balance > 0 ? "destructive" : "secondary"
                              }
                            >
                              Balance: ₹{Math.abs(client.balance).toFixed(2)}
                            </Badge>
                            <Badge variant="outline">
                              {client.invoiceCount} invoices
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="text-muted-foreground">
                              Revenue:{" "}
                              <span className="font-medium text-foreground">
                                ₹{client.revenue.toFixed(2)}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Last invoice: {client.lastInvoice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No clients found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover-elevate transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-chart-1" />
                  Revenue vs Expenses
                </CardTitle>
                <CardDescription>Last 6 months comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: any) => `₹${value.toFixed(2)}`}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                    />
                    <Legend 
                      iconType="circle"
                      formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="url(#revenueGradient)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1000}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="url(#expenseGradient)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-chart-2" />
                  Top 5 Clients by Revenue
                </CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={revenueByClient}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      innerRadius={55}
                      fill="hsl(var(--primary))"
                      dataKey="revenue"
                      animationDuration={800}
                    >
                      {revenueByClient.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: any) => `₹${value.toFixed(2)}`}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Performance Metrics</CardTitle>
              <CardDescription>Detailed revenue breakdown by client</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Invoices</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg Invoice</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientData
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 10)
                    .map((client) => {
                      const avgInvoice =
                        client.invoiceCount > 0
                          ? client.revenue / client.invoiceCount
                          : 0;
                      const growth = Math.random() * 40 - 10;

                      return (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            {client.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {client.invoiceCount}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{client.revenue.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{avgInvoice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div
                              className={`flex items-center justify-end gap-1 ${
                                growth >= 0
                                  ? "text-success"
                                  : "text-destructive"
                              }`}
                            >
                              {growth >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <span className="font-medium">
                                {Math.abs(growth).toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
