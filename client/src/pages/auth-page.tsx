import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import cybaemLogo from "@assets/LOGO Cybaem tech Final_transparent_1762929751659.png";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  //todo: remove mock functionality
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { loginEmail, loginPassword });
    
    if (loginEmail === "demo@business.com" && loginPassword === "demo123") {
      localStorage.setItem("loggedInUser", JSON.stringify({ email: loginEmail, name: "Demo User" }));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      setLocation("/");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Try demo@business.com / demo123",
        variant: "destructive",
      });
    }
  };

  //todo: remove mock functionality
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt:", { signupName, signupEmail, signupPassword });
    
    if (signupEmail && signupPassword && signupName) {
      localStorage.setItem("loggedInUser", JSON.stringify({ email: signupEmail, name: signupName }));
      toast({
        title: "Account created",
        description: "Welcome to BizAccounting!",
      });
      setLocation("/setup");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-primary text-primary-foreground p-12">
        <div className="max-w-md">
          <div className="flex flex-col items-center mb-8">
            <img src={cybaemLogo} alt="Cybaem Tech" className="h-24 w-auto mb-4" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Manage Your Business with Ease</h2>
          <p className="text-lg opacity-90 mb-6">
            Complete invoicing and accounting solution for modern businesses. Beyond Limits.
          </p>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>Professional invoice generation with GST calculation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>Real-time inventory tracking and low stock alerts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>Comprehensive financial reports and analytics</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
            <div className="flex flex-col items-center mb-4">
              <img src={cybaemLogo} alt="Cybaem Tech" className="h-16 w-auto" />
            </div>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="demo@business.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="demo123"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Demo credentials: demo@business.com / demo123
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" data-testid="button-login">
                      Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <form onSubmit={handleSignup}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Get started with BizAccounting today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        data-testid="input-signup-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@business.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        data-testid="input-signup-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        data-testid="input-signup-password"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" data-testid="button-signup">
                      Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
