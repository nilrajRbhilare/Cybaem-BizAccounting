import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Scan, ArrowLeft, ArrowRight, Check, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ClientDetails {
  name: string;
  email: string;
  phone: string;
}

export default function MobileInvoiceFlow() {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<ClientDetails>({
    name: "",
    email: "",
    phone: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const { toast } = useToast();

  const [currentItem, setCurrentItem] = useState({
    name: "",
    quantity: 1,
    price: 0,
  });

  const handleAddItem = () => {
    if (!currentItem.name || currentItem.price <= 0) {
      toast({
        title: "Invalid item",
        description: "Please enter item name and valid price",
        variant: "destructive",
      });
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        ...currentItem,
      },
    ]);

    setCurrentItem({ name: "", quantity: 1, price: 0 });
    toast({
      title: "Item added",
      description: `${currentItem.name} has been added to the invoice`,
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleScanItem = () => {
    setScanModalOpen(true);
    setTimeout(() => {
      setScanModalOpen(false);
      setCurrentItem({
        name: "Scanned Product XYZ",
        quantity: 1,
        price: 299.99,
      });
      toast({
        title: "Item scanned",
        description: "Product information loaded from barcode",
      });
    }, 1500);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const canProceedStep1 = client.name && client.email && client.phone;
  const canProceedStep2 = items.length > 0;

  const handleConfirmInvoice = () => {
    toast({
      title: "Invoice created",
      description: `Invoice for ${client.name} has been created successfully`,
    });
    setStep(1);
    setClient({ name: "", email: "", phone: "" });
    setItems([]);
  };

  const progressSteps = [
    { number: 1, label: "Client" },
    { number: 2, label: "Items" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-card border-b">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Create Invoice</h1>
            <Badge variant="secondary">
              Step {step} of 3
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {progressSteps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step > s.number
                        ? "bg-success text-success-foreground"
                        : step === s.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${s.number}`}
                  >
                    {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                  </div>
                  <span className="text-xs mt-1 text-center">{s.label}</span>
                </div>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      step > s.number ? "bg-success" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {step === 1 && (
          <Card className="animate-fadeIn">
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
              <CardDescription>
                Enter client information or select from existing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  placeholder="Enter client name"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  data-testid="input-client-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Email *</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="client@example.com"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  data-testid="input-client-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-phone">Phone *</Label>
                <Input
                  id="client-phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={client.phone}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  data-testid="input-client-phone"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
                <CardDescription>
                  Add products or services to the invoice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="Product or service name"
                    value={currentItem.name}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, name: e.target.value })
                    }
                    data-testid="input-item-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-quantity">Quantity</Label>
                    <Input
                      id="item-quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      data-testid="input-item-quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price</Label>
                    <Input
                      id="item-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentItem.price}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      data-testid="input-item-price"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleScanItem}
                    data-testid="button-scan-item"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Scan to Add
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    className="flex-1"
                    data-testid="button-add-item"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Items Added ({items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                      data-testid={`item-${item.id}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
                <CardDescription>Review and confirm invoice details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Client Information</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Name: <span className="text-foreground">{client.name}</span></p>
                    <p className="text-muted-foreground">Email: <span className="text-foreground">{client.email}</span></p>
                    <p className="text-muted-foreground">Phone: <span className="text-foreground">{client.phone}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Items ({items.length})</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.name} ({item.quantity} × ${item.price.toFixed(2)})
                        </span>
                        <span className="font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (18%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              data-testid="button-previous"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              className="flex-1"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              data-testid="button-next"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="flex-1 bg-success text-success-foreground hover:bg-success"
              onClick={handleConfirmInvoice}
              data-testid="button-confirm-invoice"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Invoice
            </Button>
          )}
        </div>
      </div>

      <Dialog open={scanModalOpen} onOpenChange={setScanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanning Item</DialogTitle>
            <DialogDescription>
              Point your camera at the barcode to scan
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-48 w-48 border-2 border-dashed border-primary rounded-lg flex items-center justify-center mb-4">
              <Scan className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Scanning...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
