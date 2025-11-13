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
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary via-teal-500 to-cyan-600 text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_60%)]"></div>
        <div className="max-w-md relative z-10 animate-fadeInUp">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-2xl">
              <img src={cybaemLogo} alt="Cybaem Tech" className="h-20 w-auto" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center">Manage Your Business with Ease</h2>
          <p className="text-lg opacity-95 mb-8 text-center">
            Complete invoicing and accounting solution for modern businesses. Beyond Limits.
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-fadeInUp stagger-delay-1">
              <span className="font-bold text-lg">✓</span>
              <span className="opacity-95">Professional invoice generation with GST calculation</span>
            </li>
            <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-fadeInUp stagger-delay-2">
              <span className="font-bold text-lg">✓</span>
              <span className="opacity-95">Real-time inventory tracking and low stock alerts</span>
            </li>
            <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-fadeInUp stagger-delay-3">
              <span className="font-bold text-lg">✓</span>
              <span className="opacity-95">Comprehensive financial reports and analytics</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="md:hidden mb-8 text-center">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-primary/10 rounded-2xl p-3 mb-2">
                <img src={cybaemLogo} alt="Cybaem Tech" className="h-12 w-auto" />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login" data-testid="tab-login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
              <TabsTrigger value="signup" data-testid="tab-signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-primary/20 shadow-lg">
                <form onSubmit={handleLogin}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login to your account</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="demo@business.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        data-testid="input-login-email"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="demo123"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        data-testid="input-login-password"
                        className="h-11"
                      />
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs text-foreground font-medium">
                        Demo credentials: demo@business.com / demo123
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-11 text-base font-semibold" data-testid="button-login">
                      Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="border-primary/20 shadow-lg">
                <form onSubmit={handleSignup}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Get started with Cybaern Tech today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        data-testid="input-signup-name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@business.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        data-testid="input-signup-email"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        data-testid="input-signup-password"
                        className="h-11"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-11 text-base font-semibold" data-testid="button-signup">
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
