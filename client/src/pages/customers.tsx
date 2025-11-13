import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/context/AppContext";
import { CustomerDialog } from "@/components/customer-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Customer } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setDialogOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, "id" | "totalInvoices" | "totalAmount">) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
      toast({
        title: "Customer updated",
        description: `${customerData.name} has been updated successfully.`,
      });
    } else {
      addCustomer(customerData);
      toast({
        title: "Customer added",
        description: `${customerData.name} has been added to your directory.`,
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete);
      toast({
        title: "Customer deleted",
        description: "Customer has been removed from your directory.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInDown">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Customers</h1>
          <p className="text-muted-foreground">Manage your customer directory</p>
        </div>
        <Button onClick={handleAddCustomer} data-testid="button-add-customer" className="transition-smooth">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card className="animate-fadeInUp stagger-delay-1">
        <CardContent className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 transition-smooth"
              data-testid="input-search-customers"
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No customers found matching your search." : "No customers yet. Add your first customer to get started."}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover-elevate hover-lift transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1" data-testid={`customer-${customer.id}`}>
                            {customer.name}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{customer.phone}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total Invoices: </span>
                              <span className="font-medium">{customer.totalInvoices}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total Amount: </span>
                              <span className="font-medium font-mono">₹{customer.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCustomer(customer)} data-testid={`button-edit-${customer.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(customer.id)} data-testid={`button-delete-${customer.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
