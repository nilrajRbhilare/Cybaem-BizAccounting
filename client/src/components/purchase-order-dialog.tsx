import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PurchaseOrder } from "@/lib/storage";
import { useAppContext } from "@/context/AppContext";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (po: Omit<PurchaseOrder, "id" | "poNumber">) => void;
}

export function PurchaseOrderDialog({ open, onOpenChange, onSave }: PurchaseOrderDialogProps) {
  const { products } = useAppContext();
  
  const [vendorName, setVendorName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<PurchaseOrder["items"]>([]);

  useEffect(() => {
    if (!open) {
      setVendorName("");
      setDate(new Date().toISOString().split("T")[0]);
      setItems([]);
    }
  }, [open]);

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", productName: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
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
    } else if (field === "price") {
      newItems[index].price = parseFloat(value) || 0;
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
    const total = items.reduce((sum, item) => sum + item.total, 0);
    
    onSave({
      vendorName,
      date,
      items,
      total,
      status: "pending",
    });
    onOpenChange(false);
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order from vendor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor Name *</Label>
                <Input
                  id="vendor"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  required
                  data-testid="input-po-vendor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  data-testid="input-po-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button type="button" size="sm" onClick={addItem} data-testid="button-add-po-item">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <Select
                            value={item.productId}
                            onValueChange={(value) => updateItem(index, "productId", value)}
                            required
                          >
                            <SelectTrigger data-testid={`select-po-item-product-${index}`}>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
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
                            data-testid={`input-po-item-quantity-${index}`}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, "price", e.target.value)}
                            placeholder="Price"
                            required
                            data-testid={`input-po-item-price-${index}`}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input value={`₹${item.total.toFixed(2)}`} disabled />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            data-testid={`button-remove-po-item-${index}`}
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
              <CardContent className="p-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total:</span>
                  <span className="font-mono">₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-po">
              Create Purchase Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
