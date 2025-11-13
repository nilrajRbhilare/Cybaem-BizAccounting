import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { ProductDialog } from "@/components/product-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Product } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const isLowStock = (stock: number, threshold: number) => stock < threshold;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "Product updated",
        description: `${productData.name} has been updated successfully.`,
      });
    } else {
      addProduct(productData);
      toast({
        title: "Product added",
        description: `${productData.name} has been added to inventory.`,
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      toast({
        title: "Product deleted",
        description: "Product has been removed from inventory.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Inventory</h1>
          <p className="text-muted-foreground">Manage your product stock and pricing</p>
        </div>
        <Button onClick={handleAddProduct} data-testid="button-add-product" className="transition-smooth">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="animate-fadeInUp stagger-delay-1">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 transition-smooth"
                data-testid="input-search-products"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || categoryFilter !== "all" ? "No products found matching your filters." : "No products yet. Add your first product to get started."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} data-testid={`product-row-${product.id}`} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {product.name}
                          {isLowStock(product.stock, product.threshold) && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={isLowStock(product.stock, product.threshold) ? "text-warning font-semibold" : "font-mono"}>
                          {product.stock} {product.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">₹{product.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        ₹{(product.stock * product.price).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} data-testid={`button-edit-${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product.id)} data-testid={`button-delete-${product.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
