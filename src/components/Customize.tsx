import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Download, Copy, Share2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "../lib/utils";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qrValue = state?.shortUrl || "https://qrcreate.example.com/demo123";

  useEffect(() => {
    console.log(state);
  }, [state]);

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
          borderRadius: 12,
          padding: 20,
          background: "var(--card)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        };
      case "circle":
        return {
          borderRadius: "50%",
          padding: 20,
          background: "var(--card)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        };
      case "shadow":
        return {
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          padding: 20,
          background: "var(--card)",
        };
      case "gradient":
        return {
          padding: 20,
          background:
            "linear-gradient(135deg, var(--background) 0%, var(--border) 100%)",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        };
      case "border":
        return {
          padding: 20,
          border: "2px solid var(--border)",
          borderRadius: 12,
          background: "var(--card)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
      downloadLink.download = `zap-qr-${state?.name || "code"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      URL.revokeObjectURL(svgUrl);
      toast.success("Your QR code has been downloaded successfully.");
    };
    img.src = svgUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    toast.success("Short link has been copied to clipboard.");
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
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Customize Your QR Code
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-card rounded-xl shadow-lg p-8 space-y-8 border border-border">
          {/* Two-column layout: Preview on left, Controls on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Preview Card */}
            <div className="flex flex-col items-center justify-center">
              <div
                ref={qrRef}
                className="bg-card p-6 rounded-xl border border-border flex items-center justify-center transition-all"
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
              <p className="text-sm text-muted-foreground mt-4">
                Scan to preview your QR code
              </p>
            </div>

            {/* Customization Controls */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                Design Options
              </h2>

              {/* Frame Style Selector */}
              <div className="space-y-2">
                <Label
                  htmlFor="frame-style"
                  className="text-base font-medium text-foreground"
                >
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
                    className="w-full rounded-md border-border bg-background text-foreground"
                  >
                    <SelectValue placeholder="Select a frame style" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border border-border bg-card text-foreground shadow-lg">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rounded">Rounded Corners</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="shadow">Shadow</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="border">Thin Border</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="logo-upload"
                  className="text-base font-medium text-foreground"
                >
                  Upload Logo (Optional)
                </Label>
                <div
                  className="relative border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer border-border bg-background hover:border-foreground/50"
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
                    <div className="flex items-center justify-center space-x-2">
                      <img
                        src={logo}
                        alt="Logo Preview"
                        className="h-16 w-16 object-contain"
                      />
                      <span className="text-foreground">Logo uploaded</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogo(null);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download QR
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="h-5 w-5" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
