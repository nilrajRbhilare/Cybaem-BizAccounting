import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { useMemo } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success";
  time: string;
}

export function NotificationsDropdown() {
  const { products, invoices } = useAppContext();

  const notifications = useMemo((): Notification[] => {
    const notifs: Notification[] = [];
    
    const lowStockProducts = products.filter(p => p.stock < p.threshold);
    lowStockProducts.forEach(product => {
      notifs.push({
        id: `low-stock-${product.id}`,
        title: "Low Stock Alert",
        message: `Product '${product.name}' is running low on stock (${product.stock} remaining)`,
        type: "warning",
        time: "Recently",
      });
    });

    const overdueInvoices = invoices.filter(inv => inv.status === "overdue");
    overdueInvoices.forEach(invoice => {
      notifs.push({
        id: `overdue-${invoice.id}`,
        title: "Invoice Overdue",
        message: `Invoice ${invoice.invoiceNumber} is overdue`,
        type: "warning",
        time: "Recently",
      });
    });

    const paidInvoices = invoices.filter(inv => inv.status === "paid").slice(0, 2);
    paidInvoices.forEach(invoice => {
      notifs.push({
        id: `paid-${invoice.id}`,
        title: "Payment Received",
        message: `Payment of ₹${invoice.total.toLocaleString()} received for Invoice ${invoice.invoiceNumber}`,
        type: "success",
        time: "Recently",
      });
    });

    return notifs.slice(0, 5);
  }, [products, invoices]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 p-4"
              data-testid={`notification-${notification.id}`}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm">{notification.title}</span>
                <Badge 
                  variant={notification.type === "warning" ? "destructive" : "default"}
                  className="ml-auto text-xs"
                >
                  {notification.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
