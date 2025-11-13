import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";

export default function Settings() {
  const { settings, updateSettings } = useAppContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [taxRate, setTaxRate] = useState("18");
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [enableNotifications, setEnableNotifications] = useState(true);

  useEffect(() => {
    setName(settings.userProfile.name);
    setEmail(settings.userProfile.email);
    setPhone(settings.userProfile.phone);
    setCompanyName(settings.companyName);
    setGstNumber(settings.gstNumber);
    setAddress(settings.address);
    setCurrency(settings.currency);
    setTaxRate(settings.taxRate.toString());
    setInvoicePrefix(settings.invoicePrefix);
    setEnableNotifications(settings.enableNotifications);
  }, [settings]);

  const handleSaveProfile = () => {
    updateSettings({
      userProfile: { name, email, phone },
    });
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveCompany = () => {
    updateSettings({
      companyName,
      gstNumber,
      address,
    });
    toast({
      title: "Company information updated",
      description: "Your company details have been saved successfully.",
    });
  };

  const handleSavePreferences = () => {
    updateSettings({
      currency,
      taxRate: parseFloat(taxRate),
      invoicePrefix,
      enableNotifications,
    });
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
          <TabsTrigger value="company" data-testid="tab-company">Company</TabsTrigger>
          <TabsTrigger value="preferences" data-testid="tab-preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance" data-testid="tab-appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="input-phone" />
              </div>
              <Button onClick={handleSaveProfile} data-testid="button-save-profile">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} data-testid="input-company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst">GST Number</Label>
                <Input id="gst" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} data-testid="input-gst-settings" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Address</Label>
                <Input id="company-address" value={address} onChange={(e) => setAddress(e.target.value)} data-testid="input-company-address" />
              </div>
              <Button onClick={handleSaveCompany} data-testid="button-save-company">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Preferences</CardTitle>
              <CardDescription>Configure your business settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                    <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  data-testid="input-tax-rate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                <Input
                  id="invoice-prefix"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  data-testid="input-invoice-prefix"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-4 border rounded-md">
                <div className="flex-1">
                  <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for low stock and overdue invoices</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={enableNotifications} 
                  onCheckedChange={setEnableNotifications}
                  data-testid="switch-notifications" 
                />
              </div>
              <Button onClick={handleSavePreferences} data-testid="button-save-preferences">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-4 border rounded-md">
                <div className="flex-1">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
