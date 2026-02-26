import { Shield, Lock, Clock, Key, Trash2, EyeOff, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const securityFeatures: SecurityFeature[] = [
  {
    id: "encryption-transit",
    title: "Encryption in Transit",
    description: "All data is transmitted using industry-standard HTTPS/SSL encryption, protecting your files during upload and access.",
    icon: Shield,
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "encryption-rest",
    title: "Encryption at Rest",
    description: "Files are encrypted on our servers using AES-256 encryption, ensuring maximum security even when stored.",
    icon: Lock,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "auto-expiry",
    title: "Automatic File Expiry",
    description: "Your files are automatically deleted after the specified time period. No permanent storage, no lingering data.",
    icon: Clock,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "password-protection",
    title: "Password Protection",
    description: "Add an extra layer of security with password protection. Passwords are securely hashed and never stored in plain text.",
    icon: Key,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    id: "self-destruct",
    title: "Self-Destruct Links",
    description: "QR codes become permanently inaccessible after expiration. Files are completely removed from our servers.",
    icon: Trash2,
    gradient: "from-red-500 to-red-600",
  },
  {
    id: "no-tracking",
    title: "No Data Tracking",
    description: "We don't analyze your file contents or share data with third parties. Your privacy is our priority.",
    icon: EyeOff,
    gradient: "from-indigo-500 to-indigo-600",
  },
];

export default function SecuritySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30"
      aria-labelledby="security-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Security & Privacy
          </div>
          <h2
            id="security-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-foreground"
          >
            Your Security is Our{" "}
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Top Priority
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ZapLink employs enterprise-grade security measures to protect your data at every step.
            Here's how we keep your files safe and private.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {securityFeatures.map((feature, index) => (
            <article
              key={feature.id}
              className={`security-card group transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative h-full bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Privacy Policy Links */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-card border border-border rounded-xl px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Learn more about how we protect your data:
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/privacy-policy"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 focus-ring rounded-md px-3 py-1"
                aria-label="Read our Privacy Policy"
              >
                Privacy Policy
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="text-border">|</span>
              <a
                href="/terms"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 focus-ring rounded-md px-3 py-1"
                aria-label="Read our Terms of Service"
              >
                Terms of Service
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
