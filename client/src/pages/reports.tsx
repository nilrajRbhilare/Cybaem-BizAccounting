import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext";
import { useMemo } from "react";
import { downloadCSV, getCurrentDate } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { invoices, purchaseOrders } = useAppContext();
  const { toast } = useToast();

  const profitLossData = useMemo(() => {
    const sales = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
    const cogs = purchaseOrders.filter(po => po.status === "received").reduce((sum, po) => sum + po.total, 0);
    const opex = cogs * 0.3; // Simplified operating expenses
    const netProfit = sales - cogs - opex;

    return [
      { category: "Sales Revenue", amount: sales, type: "income" },
      { category: "Cost of Goods Sold", amount: -cogs, type: "expense" },
      { category: "Operating Expenses", amount: -opex, type: "expense" },
      { category: "Net Profit", amount: netProfit, type: "profit" },
    ];
  }, [invoices, purchaseOrders]);

  const gstSummary = useMemo(() => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const calculateGST = (invs: typeof invoices) => {
      const sales = invs.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.subtotal, 0);
      const totalTax = invs.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.tax, 0);
      const cgst = totalTax / 2;
      const sgst = totalTax / 2;
      
      return { sales, cgst, sgst, igst: 0, total: totalTax };
    };

    const currentMonthData = calculateGST(invoices.filter(inv => {
      const invDate = new Date(inv.date);
      const now = new Date();
      return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
    }));

    const lastMonthData = calculateGST(invoices.filter(inv => {
      const invDate = new Date(inv.date);
      const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
      return invDate.getMonth() === lastMonthDate.getMonth() && invDate.getFullYear() === lastMonthDate.getFullYear();
    }));

    return [
      { month: currentMonth, ...currentMonthData },
      { month: lastMonth, ...lastMonthData },
    ];
  }, [invoices]);

  const handleExportProfitLoss = () => {
    const csvData = {
      headers: ['Category', 'Type', 'Amount (₹)'],
      rows: profitLossData.map(row => [
        row.category,
        row.type,
        Math.abs(row.amount).toFixed(2)
      ]),
      filename: `Profit_Loss_Statement_${getCurrentDate().replace(/\s+/g, '_')}`
    };
    downloadCSV(csvData);
    toast({
      title: "Export successful",
      description: "Profit & Loss statement has been downloaded as CSV.",
    });
  };

  const handleExportGST = () => {
    const csvData = {
      headers: ['Period', 'Sales (₹)', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)', 'Total GST (₹)'],
      rows: gstSummary.map(row => [
        row.month,
        row.sales.toFixed(2),
        row.cgst.toFixed(2),
        row.sgst.toFixed(2),
        row.igst.toFixed(2),
        row.total.toFixed(2)
      ]),
      filename: `GST_Summary_${getCurrentDate().replace(/\s+/g, '_')}`
    };
    downloadCSV(csvData);
    toast({
      title: "Export successful",
      description: "GST Summary has been downloaded as CSV.",
    });
  };

  const reportCards = [
    {
      title: "Profit & Loss",
      description: "Comprehensive income statement for the current period",
      icon: TrendingUp,
      color: "text-chart-1",
    },
    {
      title: "Balance Sheet",
      description: "Assets, liabilities, and equity overview",
      icon: BarChart3,
      color: "text-chart-2",
    },
    {
      title: "GST Summary",
      description: "Tax collection and payment details",
      icon: DollarSign,
      color: "text-chart-3",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Reports</h1>
        <p className="text-muted-foreground">Financial reports and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reportCards.map((report, index) => (
          <Card key={report.title} className={`hover-elevate hover-lift transition-smooth animate-scaleIn stagger-delay-${index + 1}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <report.icon className={`h-5 w-5 ${report.color}`} />
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-1">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button size="sm" variant="outline" className="w-full" data-testid={`button-view-${report.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fadeInUp stagger-delay-4">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle>Profit & Loss Statement</CardTitle>
            <CardDescription>For the current period</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportProfitLoss}
            data-testid="button-download-pl"
            className="transition-smooth"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitLossData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className={row.type === "profit" ? "font-semibold" : ""}>
                      {row.category}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${row.type === "profit" ? "font-semibold text-success" : row.type === "expense" ? "text-destructive" : ""}`}>
                      ₹{Math.abs(row.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fadeInUp stagger-delay-5">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle>GST Summary</CardTitle>
            <CardDescription>Tax collection summary by month</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportGST}
            data-testid="button-download-gst"
            className="transition-smooth"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">CGST</TableHead>
                  <TableHead className="text-right">SGST</TableHead>
                  <TableHead className="text-right">IGST</TableHead>
                  <TableHead className="text-right">Total GST</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gstSummary.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right font-mono">₹{row.sales.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">₹{row.cgst.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">₹{row.sgst.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">₹{row.igst.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">₹{row.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
