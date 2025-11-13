import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "wouter";

export function ProfileDropdown() {
  const { settings } = useAppContext();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("companyData");
    setLocation("/login");
  };

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 gap-2 px-2" data-testid="button-profile">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{getInitials(settings.userProfile.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm hidden md:inline-block">{settings.userProfile.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{settings.userProfile.name}</p>
            <p className="text-xs text-muted-foreground">{settings.userProfile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigate("/settings")} data-testid="menu-profile">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate("/settings")} data-testid="menu-settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
