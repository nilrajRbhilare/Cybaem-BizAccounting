import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanySetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      //todo: remove mock functionality
      const companyData = {
        companyName,
        gstNumber,
        address,
        bankName,
        accountNumber,
        ifscCode,
      };
      localStorage.setItem("companyData", JSON.stringify(companyData));
      console.log("Company setup completed:", companyData);
      toast({
        title: "Setup completed",
        description: "Your company profile has been created successfully!",
      });
      setLocation("/");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">BizAccounting</h1>
              <p className="text-sm text-muted-foreground">Company Setup</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Company Information"}
              {step === 2 && "Tax Details"}
              {step === 3 && "Bank Details"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter your company's basic information"}
              {step === 2 && "Provide GST and address details"}
              {step === 3 && "Add your banking information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    placeholder="ABC Enterprises Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    data-testid="input-company-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Business Street, City, State - 123456"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    data-testid="input-address"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gst-number">GST Number</Label>
                  <Input
                    id="gst-number"
                    placeholder="22AAAAA0000A1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    data-testid="input-gst"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if not registered
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name *</Label>
                  <Input
                    id="bank-name"
                    placeholder="State Bank of India"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    data-testid="input-bank-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number *</Label>
                  <Input
                    id="account-number"
                    placeholder="1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    data-testid="input-account-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc-code">IFSC Code *</Label>
                  <Input
                    id="ifsc-code"
                    placeholder="SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    required
                    data-testid="input-ifsc"
                  />
                </div>
              </>
            )}

            <div className="flex justify-between gap-4 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                className={step === 1 ? "w-full" : "ml-auto"}
                data-testid="button-next"
              >
                {step === totalSteps ? "Complete Setup" : "Next"}
                {step < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
