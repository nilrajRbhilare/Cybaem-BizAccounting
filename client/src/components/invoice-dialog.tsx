import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice, InvoiceItem } from "@/lib/storage";
import { useAppContext, useInvoiceCalculation } from "@/context/AppContext";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSave: (invoice: Omit<Invoice, "id" | "invoiceNumber">) => void;
}

export function InvoiceDialog({ open, onOpenChange, invoice, onSave }: InvoiceDialogProps) {
  const { customers, products } = useAppContext();
  const { calculateTotals, taxRate } = useInvoiceCalculation();
  
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [status, setStatus] = useState<Invoice["status"]>("draft");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (invoice) {
      setCustomerId(invoice.customerId);
      setDate(invoice.date);
      setItems(invoice.items);
      setStatus(invoice.status);
      setNotes(invoice.notes || "");
    } else {
      setCustomerId("");
      setDate(new Date().toISOString().split("T")[0]);
      setItems([]);
      setStatus("draft");
      setNotes("");
    }
  }, [invoice, open]);

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", productName: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        newItems[index].productId = product.id;
        newItems[index].productName = product.name;
        newItems[index].price = product.price;
        newItems[index].total = product.price * newItems[index].quantity;
      }
    } else if (field === "quantity") {
      newItems[index].quantity = parseInt(value) || 0;
      newItems[index].total = newItems[index].price * newItems[index].quantity;
    }
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }
    const { subtotal, tax, total } = calculateTotals(items);
    const customer = customers.find((c) => c.id === customerId);
    
    onSave({
      customerId,
      customerName: customer?.name || "",
      date,
      items,
      subtotal,
      tax,
      total,
      status,
      notes,
    });
    onOpenChange(false);
  };

  const { subtotal, tax, total } = calculateTotals(items);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{invoice ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
            <DialogDescription>
              {invoice ? "Update invoice details" : "Create a new invoice for your customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select value={customerId} onValueChange={setCustomerId} required>
                  <SelectTrigger id="customer" data-testid="select-invoice-customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  data-testid="input-invoice-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button type="button" size="sm" onClick={addItem} data-testid="button-add-item">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-5">
                          <Select
                            value={item.productId}
                            onValueChange={(value) => updateItem(index, "productId", value)}
                            required
                          >
                            <SelectTrigger data-testid={`select-item-product-${index}`}>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} (₹{product.price})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                            placeholder="Qty"
                            required
                            data-testid={`input-item-quantity-${index}`}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input value={`₹${item.price}`} disabled />
                        </div>
                        <div className="col-span-2">
                          <Input value={`₹${item.total}`} disabled />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span className="font-mono">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Total:</span>
                  <span className="font-mono">₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Invoice["status"])}>
                <SelectTrigger id="status" data-testid="select-invoice-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                data-testid="input-invoice-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-invoice">
              {invoice ? "Update" : "Create"} Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
