import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Mail, Phone, Edit, Trash2, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/context/AppContext";
import { PartyDialog } from "@/components/party-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Party } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Parties() {
    const { parties, addParty, updateParty, deleteParty } = useAppContext();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [partyToDelete, setPartyToDelete] = useState<string | null>(null);

    const filteredParties = parties.filter(
        (party) =>
            party.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            party.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            party.mobileNumber.includes(searchQuery)
    );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleAddParty = () => {
        setEditingParty(null);
        setDialogOpen(true);
    };

    const handleEditParty = (party: Party) => {
        setEditingParty(party);
        setDialogOpen(true);
    };

    const handleSaveParty = (partyData: Omit<Party, "id">) => {
        if (editingParty) {
            updateParty(editingParty.id, partyData);
            toast({
                title: "Party updated",
                description: `${partyData.partyName} has been updated successfully.`,
            });
        } else {
            addParty(partyData);
            toast({
                title: "Party added",
                description: `${partyData.partyName} has been added to your directory.`,
            });
        }
    };

    const handleDeleteClick = (id: string) => {
        setPartyToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (partyToDelete) {
            deleteParty(partyToDelete);
            toast({
                title: "Party deleted",
                description: "Party has been removed from your directory.",
            });
        }
    };

    const getPartyTypeColor = (type: string) => {
        switch (type) {
            case "Customer":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Vendor":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "Both":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInDown">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Parties</h1>
                    <p className="text-muted-foreground">Manage your party directory</p>
                </div>
                <Button onClick={handleAddParty} data-testid="button-add-party" className="transition-smooth">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Party
                </Button>
            </div>

            <Card className="animate-fadeInUp stagger-delay-1">
                <CardContent className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search parties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 transition-smooth"
                            data-testid="input-search-parties"
                        />
                    </div>

                    {filteredParties.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            {searchQuery
                                ? "No parties found matching your search."
                                : "No parties yet. Add your first party to get started."}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredParties.map((party) => (
                                <Card key={party.id} className="hover-elevate hover-lift transition-smooth">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <Avatar className="h-12 w-12 flex-shrink-0">
                                                    <AvatarFallback>
                                                        <Building2 className="h-6 w-6" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-lg" data-testid={`party-${party.id}`}>
                                                            {party.partyName}
                                                        </h3>
                                                        <Badge className={getPartyTypeColor(party.partyType)}>
                                                            {party.partyType}
                                                        </Badge>
                                                        {party.partyCategory && (
                                                            <Badge variant="outline">{party.partyCategory}</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                        {party.email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                <span className="truncate">{party.email}</span>
                                                            </div>
                                                        )}
                                                        {party.mobileNumber && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                <span>{party.mobileNumber}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Opening Balance: </span>
                                                            <span className="font-medium font-mono">
                                                                ₹{party.openingBalance.toLocaleString()}
                                                            </span>
                                                            <span className="text-muted-foreground ml-1">({party.balanceType})</span>
                                                        </div>
                                                        {party.creditLimit !== undefined && party.creditLimit > 0 && (
                                                            <div>
                                                                <span className="text-muted-foreground">Credit Limit: </span>
                                                                <span className="font-medium font-mono">
                                                                    ₹{party.creditLimit.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {party.creditPeriod !== undefined && party.creditPeriod > 0 && (
                                                            <div>
                                                                <span className="text-muted-foreground">Credit Period: </span>
                                                                <span className="font-medium">{party.creditPeriod} Days</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {party.gstin && (
                                                        <div className="mt-2 text-xs text-muted-foreground">
                                                            <span>GSTIN: </span>
                                                            <span className="font-mono">{party.gstin}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditParty(party)}
                                                    data-testid={`button-edit-${party.id}`}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(party.id)}
                                                    data-testid={`button-delete-${party.id}`}
                                                >
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

            <PartyDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                party={editingParty}
                onSave={handleSaveParty}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Party"
                description="Are you sure you want to delete this party? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
                variant="destructive"
            />
        </div>
    );
}
