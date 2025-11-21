import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Party } from "@/lib/storage";

interface PartyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    party: Party | null;
    onSave: (party: Omit<Party, "id">) => void;
}

export function PartyDialog({ open, onOpenChange, party, onSave }: PartyDialogProps) {
    const [formData, setFormData] = useState<Omit<Party, "id">>({
        partyName: "",
        mobileNumber: "",
        email: "",
        openingBalance: 0,
        balanceType: "To Collect",
        gstin: "",
        panNumber: "",
        partyType: "Customer",
        partyCategory: "",
        billingAddress: "",
        shippingAddress: "",
        sameAsBilling: true,
        creditPeriod: 30,
        creditLimit: 0,
    });

    useEffect(() => {
        if (party) {
            const { id, ...rest } = party;
            setFormData(rest);
        } else {
            setFormData({
                partyName: "",
                mobileNumber: "",
                email: "",
                openingBalance: 0,
                balanceType: "To Collect",
                gstin: "",
                panNumber: "",
                partyType: "Customer",
                partyCategory: "",
                billingAddress: "",
                shippingAddress: "",
                sameAsBilling: true,
                creditPeriod: 30,
                creditLimit: 0,
            });
        }
    }, [party, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    const handleSameAsBillingChange = (checked: boolean) => {
        setFormData({
            ...formData,
            sameAsBilling: checked,
            shippingAddress: checked ? formData.billingAddress : formData.shippingAddress,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{party ? "Edit Party" : "Create Party"}</DialogTitle>
                    <DialogDescription>
                        {party ? "Update party details below." : "Add a new party to your directory."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        {/* General Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">General Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="partyName">
                                        Party Name<span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="partyName"
                                        required
                                        value={formData.partyName}
                                        onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                                    <Input
                                        id="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="openingBalance">Opening Balance</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="openingBalance"
                                            type="number"
                                            value={formData.openingBalance}
                                            onChange={(e) =>
                                                setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })
                                            }
                                            placeholder="0"
                                            className="flex-1"
                                        />
                                        <Select
                                            value={formData.balanceType}
                                            onValueChange={(value: "To Collect" | "To Pay") =>
                                                setFormData({ ...formData, balanceType: value })
                                            }
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="To Collect">To Collect</SelectItem>
                                                <SelectItem value="To Pay">To Pay</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tax Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">GSTIN</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        id="gstin"
                                        value={formData.gstin}
                                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                        placeholder="29AAAAA0000A1Z5"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Note: You can auto-populate party details from GSTIN
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">PAN Number</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        id="panNumber"
                                        value={formData.panNumber}
                                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                                        placeholder="Enter party PAN Number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Party Classification */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="partyType">
                                        Party Type<span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.partyType}
                                        onValueChange={(value: "Customer" | "Vendor" | "Both") =>
                                            setFormData({ ...formData, partyType: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Customer">Customer</SelectItem>
                                            <SelectItem value="Vendor">Vendor</SelectItem>
                                            <SelectItem value="Both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="partyCategory">Party Category</Label>
                                    <Select
                                        value={formData.partyCategory}
                                        onValueChange={(value) => setFormData({ ...formData, partyCategory: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Retail">Retail</SelectItem>
                                            <SelectItem value="Wholesale">Wholesale</SelectItem>
                                            <SelectItem value="Distributor">Distributor</SelectItem>
                                            <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                                            <SelectItem value="Service Provider">Service Provider</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Address</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="billingAddress">Billing Address</Label>
                                    <Textarea
                                        id="billingAddress"
                                        value={formData.billingAddress}
                                        onChange={(e) => {
                                            const newBillingAddress = e.target.value;
                                            setFormData({
                                                ...formData,
                                                billingAddress: newBillingAddress,
                                                shippingAddress: formData.sameAsBilling ? newBillingAddress : formData.shippingAddress,
                                            });
                                        }}
                                        placeholder="Enter billing address"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shippingAddress">Shipping Address</Label>
                                    <Textarea
                                        id="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                        placeholder="Enter shipping address"
                                        rows={3}
                                        disabled={formData.sameAsBilling}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="sameAsBilling"
                                            checked={formData.sameAsBilling}
                                            onCheckedChange={handleSameAsBillingChange}
                                        />
                                        <label
                                            htmlFor="sameAsBilling"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Same as Billing address
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Credit Terms */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Credit Period</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            id="creditPeriod"
                                            type="number"
                                            value={formData.creditPeriod}
                                            onChange={(e) =>
                                                setFormData({ ...formData, creditPeriod: parseInt(e.target.value) || 0 })
                                            }
                                            placeholder="30"
                                            className="flex-1"
                                        />
                                        <span className="text-sm text-muted-foreground">Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Credit Limit</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex gap-2 items-center">
                                        <span className="text-sm">₹</span>
                                        <Input
                                            id="creditLimit"
                                            type="number"
                                            value={formData.creditLimit}
                                            onChange={(e) =>
                                                setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })
                                            }
                                            placeholder="0"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
