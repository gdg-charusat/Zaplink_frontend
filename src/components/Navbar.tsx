import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Zap, Menu, X } from "lucide-react";

export default function Navbar({
  hideNavOptions = false,
}: {
  hideNavOptions?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-xl flex items-center gap-3 text-foreground group transition-all duration-300 hover:scale-105 focus-ring rounded-lg p-2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <span className="gradient-text-primary font-semibold">
            ZapLink
          </span>
        </Link>
        {!hideNavOptions && (
          <>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group focus-ring rounded-lg px-3 py-2"
              >
                Home
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </Link>
              <Link
                to="/how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group focus-ring rounded-lg px-3 py-2"
              >
                How it Works
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group focus-ring rounded-lg px-3 py-2"
              >
                About Us
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </Link>
              <ThemeToggle />
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-muted-foreground hover:text-foreground transition-all duration-200 focus-ring rounded-lg"
                aria-label="Toggle Menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </>
        )}
        {hideNavOptions && (
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {!hideNavOptions && isOpen && (
        <div className="md:hidden glass-nav border-t border-border/50 animate-in fade-in slide-in-from-top-5 duration-300">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 p-3 rounded-xl transition-all duration-200 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Home
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 p-3 rounded-xl transition-all duration-200 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              How it Works
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 p-3 rounded-xl transition-all duration-200 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              About Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}