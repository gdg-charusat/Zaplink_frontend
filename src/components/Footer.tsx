import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "About Us", to: "/about" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/gdg-charusat/Zaplink_frontend",
    icon: Github,
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/gdgcharusat",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/gdgcharusat",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-background/80 backdrop-blur-md">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Main 3-column grid on md+, stacked on mobile */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* ── Column 1 : Brand ── */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link
              to="/"
              className="font-bold text-xl flex items-center gap-2.5 group transition-all duration-300 hover:scale-105 focus-ring rounded-lg p-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-lg">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <span className="gradient-text-primary font-semibold">ZapLink</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-[220px] leading-relaxed">
              Fast &amp; secure file sharing — share anything, instantly.
            </p>
          </div>

          {/* ── Column 2 : Navigation ── */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigate
            </h3>
            <nav className="flex flex-col items-center md:items-start gap-2.5">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group focus-ring rounded-md px-1 py-0.5"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Column 3 : Social ── */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_0_14px_hsl(var(--primary)/0.25)] transition-all duration-300 hover:scale-110 focus-ring"
                >
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom divider + copyright ── */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 ZapLink. All rights reserved.</span>
          <span className="hidden sm:block">
            Made with{" "}
            <span className="text-primary" aria-label="love">
              ♥
            </span>{" "}
            for fast sharing
          </span>
        </div>
      </div>
    </footer>
  );
}
