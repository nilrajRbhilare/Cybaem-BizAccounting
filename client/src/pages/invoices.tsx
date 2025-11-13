import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Plus, Search, Download, Eye, Edit, Trash2 } from "lucide-react";
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
import { InvoiceDialog } from "@/components/invoice-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Invoice } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Invoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setDialogOpen(true);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, "id" | "invoiceNumber">) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoiceData);
      toast({
        title: "Invoice updated",
        description: `Invoice has been updated successfully.`,
      });
    } else {
      addInvoice(invoiceData);
      toast({
        title: "Invoice created",
        description: `Invoice has been created successfully.`,
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete);
      toast({
        title: "Invoice deleted",
        description: "Invoice has been removed successfully.",
      });
    }
  };

  const handleDownload = (invoiceId: string) => {
    toast({
      title: "Download started",
      description: "Invoice PDF will be downloaded shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Invoices</h1>
          <p className="text-muted-foreground">Manage and track all your invoices</p>
        </div>
        <Button onClick={handleAddInvoice} data-testid="button-new-invoice" className="transition-smooth">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <Card className="animate-fadeInUp stagger-delay-1">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 transition-smooth"
                data-testid="input-search-invoices"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || statusFilter !== "all" ? "No invoices found matching your filters." : "No invoices yet. Create your first invoice to get started."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} data-testid={`invoice-row-${invoice.id}`} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell>{invoice.items.length}</TableCell>
                      <TableCell className="text-right font-mono">₹{invoice.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" data-testid={`button-view-${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditInvoice(invoice)} data-testid={`button-edit-${invoice.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(invoice.id)} data-testid={`button-download-${invoice.id}`}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(invoice.id)} data-testid={`button-delete-${invoice.id}`}>
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

      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoice={editingInvoice}
        onSave={handleSaveInvoice}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
