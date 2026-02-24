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
  BarChart3,
  Activity,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

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
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-7xl">

        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Secure QR Code Generator
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="gradient-text">Share Files with</span>
            <br />
            <span className="gradient-text-primary">Secure QR Codes</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
            Transform any file into a secure, shareable QR code with password
            protection, self-destruct options, and now real-time analytics tracking.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-ring"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="inline-flex items-center gap-3 border border-border hover:bg-muted px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 focus-ring"
            >
              <BarChart3 className="h-5 w-5" />
              View Analytics Demo
            </button>
          </div>
        </div>

        {/* CONTENT TYPES */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              What would you like to share?
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your content type and create a QR code instantly
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() =>
                  navigate("/upload", { state: { type: type.id } })
                }
                className="group content-type-card text-left focus-ring"
              >
                <div className="relative z-20 flex flex-col items-center gap-6">
                  <div
                    className={cn(
                      "p-5 rounded-2xl bg-gradient-to-br transition-all duration-300 shadow-lg",
                      "group-hover:scale-110 group-hover:shadow-xl",
                      type.color
                    )}
                  >
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {type.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ANALYTICS FEATURE SECTION */}
        <div className="mb-24">
          <div className="bg-card border border-border rounded-3xl p-10 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              <div>
                <div className="inline-flex items-center gap-2 text-primary font-medium mb-4">
                  <Activity className="h-5 w-5" />
                  New Feature
                </div>

                <h3 className="text-3xl font-bold mb-6 text-foreground">
                  Real-Time Zap Analytics
                </h3>

                <p className="text-muted-foreground text-lg mb-6">
                  Track views, device types, browser usage, and expiry status
                  in real-time. Know exactly how your shared content is accessed.
                </p>

                <ul className="space-y-3 text-muted-foreground">
                  <li>• Live view counter</li>
                  <li>• Device & browser insights</li>
                  <li>• Access timestamps</li>
                  <li>• Expiry countdown timer</li>
                </ul>

                <button
                  onClick={() => navigate("/analytics")}
                  className="mt-8 inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-muted rounded-2xl p-8 border border-border text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-6 text-primary" />
                <p className="text-muted-foreground">
                  Professional analytics dashboard designed for secure content sharing.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}