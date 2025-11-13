import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/lib/storage";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: Omit<Product, "id">) => void;
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (product) {
      setSku(product.sku);
      setName(product.name);
      setCategory(product.category);
      setStock(product.stock.toString());
      setThreshold(product.threshold.toString());
      setPrice(product.price.toString());
      setUnit(product.unit);
      setDescription(product.description || "");
    } else {
      setSku("");
      setName("");
      setCategory("");
      setStock("0");
      setThreshold("10");
      setPrice("");
      setUnit("pcs");
      setDescription("");
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      sku,
      name,
      category,
      stock: parseInt(stock),
      threshold: parseInt(threshold),
      price: parseFloat(price),
      unit,
      description,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>
              {product ? "Update product information" : "Add a new product to your inventory"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                data-testid="input-product-sku"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-product-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" data-testid="select-product-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  data-testid="input-product-stock"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Low Stock Threshold *</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  required
                  data-testid="input-product-threshold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Unit Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  data-testid="input-product-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger id="unit" data-testid="select-product-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                    <SelectItem value="reams">Reams</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-product-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-product">
              {product ? "Update" : "Add"} Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
