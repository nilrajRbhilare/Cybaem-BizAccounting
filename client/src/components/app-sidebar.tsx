import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Settings,
  Smartphone,
  BriefcaseBusiness
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import cybaemLogo from "@assets/LOGO Cybaem tech Final_transparent_1762929751659.png";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Quick Invoice",
    url: "/mobile-invoice",
    icon: Smartphone,
  },
  {
    title: "Accountant Portal",
    url: "/accountant-portal",
    icon: BriefcaseBusiness,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Purchase Orders",
    url: "/purchase-orders",
    icon: ShoppingCart,
  },
  {
    title: "Bank Reconciliation",
    url: "/bank-reconciliation",
    icon: CreditCard,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Link href="/" data-testid="link-logo">
          <div className="flex items-center justify-center hover-elevate active-elevate-2 transition-smooth rounded-md p-2 -m-2">
            <img src={cybaemLogo} alt="Cybaem Tech" className="h-10 w-auto" />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
