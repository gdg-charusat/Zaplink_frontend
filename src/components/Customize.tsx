import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  Copy,
  Share2,
  X,
  Palette,
  Sparkles,
  Check,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { toast } from "sonner";

type FrameOption =
  | "none"
  | "rounded"
  | "circle"
  | "shadow"
  | "gradient"
  | "border";

type CustomizePageState = {
  zapId: string;
  shortUrl: string;
  qrCode: string;
  type: string;
  name: string;
};

export default function CustomizePage() {
  const location = useLocation();
  const state = (location.state as CustomizePageState) || null;
  const qrRef = useRef<HTMLDivElement>(null);

  const [frameStyle, setFrameStyle] = useState<FrameOption>("none");
  const [logo, setLogo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qrValue = state?.shortUrl || "https://zaplink.example.com/demo123";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setLogo(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getFrameStyle = (): React.CSSProperties => {
    switch (frameStyle) {
      case "rounded":
        return {
          borderRadius: 24,
          padding: 24,
          background: "hsl(var(--card))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid hsl(var(--border))",
        };
      case "circle":
        return {
          borderRadius: "50%",
          padding: 24,
          background: "hsl(var(--card))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid hsl(var(--border))",
        };
      case "shadow":
        return {
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          padding: 24,
          background: "hsl(var(--card))",
          borderRadius: 16,
        };
      case "gradient":
        return {
          padding: 24,
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
          borderRadius: 20,
          boxShadow: "0 8px 32px hsl(var(--primary) / 0.3)",
        };
      case "border":
        return {
          padding: 24,
          border: "3px solid hsl(var(--primary))",
          borderRadius: 16,
          background: "hsl(var(--card))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        };
      default:
        return {};
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `zaplink-qr-${state?.name || "code"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      URL.revokeObjectURL(svgUrl);
      toast.success("Your QR code has been downloaded successfully.");
    };
    img.src = svgUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      toast.success("Short link has been copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My QR Code",
          text: "Check out my QR code",
          url: qrValue,
        })
        .catch(() => toast.error("Error sharing, please try again."));
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="bg-card rounded-3xl shadow-lg p-6 sm:p-8 space-y-8 border border-border">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
              Step 3 of 3
            </span>
            <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="progress-bar h-full w-full"></div>
            </div>
            <span className="text-xs sm:text-sm text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Ready!
            </span>
          </div>

          {/* Two-column layout: Preview on left, Controls on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* QR Preview Card */}
            <div className="flex flex-col items-center justify-center order-2 lg:order-1">
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-8 sm:p-12 rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm">
                <div
                  ref={qrRef}
                  className="flex items-center justify-center transition-all duration-500 hover:scale-105"
                  style={getFrameStyle()}
                >
                  <QRCodeSVG
                    value={qrValue}
                    size={240}
                    bgColor="#fff"
                    fgColor="#000"
                    level="H"
                    includeMargin
                    imageSettings={
                      logo
                        ? { src: logo, height: 50, width: 50, excavate: true }
                        : undefined
                    }
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6 text-center">
                Scan to preview your QR code
              </p>
            </div>

            {/* Customization Controls */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Design Options
                </h2>
              </div>

              {/* Frame Style Selector */}
              <div className="space-y-4">
                <Label
                  htmlFor="frame-style"
                  className="text-base font-semibold text-foreground flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Frame Style
                </Label>
                <Select
                  value={frameStyle}
                  onValueChange={(value: string) =>
                    setFrameStyle(value as FrameOption)
                  }
                >
                  <SelectTrigger
                    id="frame-style"
                    className="w-full h-12 rounded-xl border-border bg-background text-foreground font-medium focus-ring"
                  >
                    <SelectValue placeholder="Select a frame style" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border bg-card text-foreground shadow-2xl">
                    <SelectItem value="none" className="rounded-lg">
                      None
                    </SelectItem>
                    <SelectItem value="rounded" className="rounded-lg">
                      Rounded Corners
                    </SelectItem>
                    <SelectItem value="circle" className="rounded-lg">
                      Circle
                    </SelectItem>
                    <SelectItem value="shadow" className="rounded-lg">
                      Shadow
                    </SelectItem>
                    <SelectItem value="gradient" className="rounded-lg">
                      Gradient
                    </SelectItem>
                    <SelectItem value="border" className="rounded-lg">
                      Accent Border
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <Label
                  htmlFor="logo-upload"
                  className="text-base font-semibold text-foreground flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Upload Logo (Optional)
                </Label>
                <div
                  className="relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                    accept="image/*"
                  />
                  {logo ? (
                    <div className="flex items-center justify-center space-x-3">
                      <img
                        src={logo}
                        alt="Logo Preview"
                        className="h-16 w-16 object-contain rounded-lg"
                      />
                      <span className="text-foreground font-medium">
                        Logo uploaded
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogo(null);
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg focus-ring"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    Actions
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl focus-ring"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download QR Code
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="h-12 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] bg-background focus-ring"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Copied!</span>
                          <span className="sm:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Copy Link</span>
                          <span className="sm:hidden">Copy</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="h-12 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] bg-background focus-ring"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <Link
              to="/upload"
              state={{ type: state?.type?.toLowerCase() || "pdf" }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 focus-ring rounded-lg p-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Upload</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}