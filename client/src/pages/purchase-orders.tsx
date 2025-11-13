import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Search, Eye, Check, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext";
import { PurchaseOrderDialog } from "@/components/purchase-order-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PurchaseOrder } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function PurchaseOrders() {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, receiveStock } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [poToDelete, setPoToDelete] = useState<string | null>(null);

  const filteredOrders = purchaseOrders.filter((po) =>
    po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPO = () => {
    setEditingPO(null);
    setDialogOpen(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO(po);
    setDialogOpen(true);
  };

  const handleSavePurchaseOrder = (poData: Omit<PurchaseOrder, "id" | "poNumber">) => {
    if (editingPO) {
      updatePurchaseOrder(editingPO.id, poData);
      toast({
        title: "Purchase order updated",
        description: `Purchase order has been updated successfully.`,
      });
    } else {
      addPurchaseOrder(poData);
      toast({
        title: "Purchase order created",
        description: `Purchase order has been created successfully.`,
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setPoToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (poToDelete) {
      deletePurchaseOrder(poToDelete);
      toast({
        title: "Purchase order deleted",
        description: "Purchase order has been removed successfully.",
      });
    }
  };

  const handleReceiveStock = (id: string) => {
    receiveStock(id);
    toast({
      title: "Stock received",
      description: "Product quantities have been updated in inventory.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Purchase Orders</h1>
          <p className="text-muted-foreground">Track and manage purchase orders</p>
        </div>
        <Button onClick={handleAddPO} data-testid="button-new-po" className="transition-smooth">
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <Card className="animate-fadeInUp stagger-delay-1">
        <CardContent className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search purchase orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 transition-smooth"
              data-testid="input-search-po"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No purchase orders found matching your search." : "No purchase orders yet. Create your first purchase order to get started."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((po) => (
                    <TableRow key={po.id} data-testid={`po-row-${po.id}`} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">{po.poNumber}</TableCell>
                      <TableCell>{po.vendorName}</TableCell>
                      <TableCell className="text-muted-foreground">{po.date}</TableCell>
                      <TableCell>{po.items.length}</TableCell>
                      <TableCell className="text-right font-mono">₹{po.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={po.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" data-testid={`button-view-${po.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditPO(po)} data-testid={`button-edit-${po.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {po.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleReceiveStock(po.id)}
                              data-testid={`button-receive-${po.id}`}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Receive
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(po.id)} data-testid={`button-delete-${po.id}`}>
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

      <PurchaseOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSavePurchaseOrder}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Purchase Order"
        description="Are you sure you want to delete this purchase order? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
