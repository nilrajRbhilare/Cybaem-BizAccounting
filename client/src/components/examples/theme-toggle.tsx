import { ThemeToggle } from "../theme-toggle";
import { ThemeProvider } from "@/lib/theme-provider";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
