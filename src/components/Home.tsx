import {
  FileText,
  ImageIcon,
  Video,
  Music,
  LinkIcon,
  Type,
  FileXIcon as DocxIcon,
  Presentation,
  Zap,
  ArrowRight,
  Shield,
  Palette,
  Clock,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import SecuritySection from "./SecuritySection";

export default function Home() {
  const navigate = useNavigate();
  const contentTypes = [
    {
      id: "pdf",
      label: "PDF",
      icon: FileText,
      color: "from-red-500 to-red-600",
      description: "Documents & Reports",
    },
    {
      id: "image",
      label: "Image",
      icon: ImageIcon,
      color: "from-blue-500 to-blue-600",
      description: "Photos & Graphics",
    },
    {
      id: "video",
      label: "Video",
      icon: Video,
      color: "from-purple-500 to-purple-600",
      description: "Movies & Clips",
    },
    {
      id: "audio",
      label: "Audio",
      icon: Music,
      color: "from-pink-500 to-pink-600",
      description: "Music & Podcasts",
    },
    {
      id: "url",
      label: "URL",
      icon: LinkIcon,
      color: "from-green-500 to-green-600",
      description: "Websites & Links",
    },
    {
      id: "text",
      label: "Text",
      icon: Type,
      color: "from-yellow-500 to-yellow-600",
      description: "Notes & Messages",
    },
    {
      id: "document",
      label: "Document",
      icon: DocxIcon,
      color: "from-indigo-500 to-indigo-600",
      description: "Word & Text Files",
    },
    {
      id: "presentation",
      label: "Presentation",
      icon: Presentation,
      color: "from-orange-500 to-orange-600",
      description: "Slides & Decks",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-7xl">
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Secure QR Code Generator
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="gradient-text">Share Files with</span>
            <br />
            <span className="gradient-text-primary">Secure QR Codes</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Transform any file into a secure, shareable QR code with password
            protection, self-destruct options, and beautiful customization.
          </p>
        </div>

        {/* Content Type Selection */}
        <div className="mb-16 sm:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
              What would you like to share?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your content type and create a QR code in seconds
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() =>
                  navigate("/upload", { state: { type: type.id } })
                }
                className="group content-type-card text-left focus-ring"
              >
                <div className="relative z-20 flex flex-col items-center gap-4 sm:gap-6">
                  <div
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl bg-gradient-to-br transition-all duration-300 shadow-lg",
                      "group-hover:scale-110 group-hover:shadow-xl",
                      type.color
                    )}
                  >
                    <type.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                      {type.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div className="feature-card">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground text-center">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground leading-relaxed text-center">
              Generate QR codes instantly with our optimized processing engine
              and cloud infrastructure. No waiting, just results.
            </p>
          </div>

          <div className="feature-card">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground text-center">
              Secure & Private
            </h3>
            <p className="text-muted-foreground leading-relaxed text-center">
              Bank-level encryption with password protection and self-destruct
              options keep your files safe and secure.
            </p>
          </div>

          <div className="feature-card">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Palette className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground text-center">
              Fully Customizable
            </h3>
            <p className="text-muted-foreground leading-relaxed text-center">
              Design your QR codes with custom frames, colors, logos, and
              professional styling options.
            </p>
          </div>
        </div>

        {/* Security & Privacy Section */}
      </main>
      <SecuritySection />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* CTA Section */}
        <div className="text-center mt-16 sm:mt-24 pb-16 sm:pb-24">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 sm:p-12 border border-primary/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold">Ready in seconds</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              Start Creating Your QR Code
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust ZapLink for secure file sharing.
              No registration required.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-ring"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}