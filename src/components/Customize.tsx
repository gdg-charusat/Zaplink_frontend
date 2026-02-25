import { useState, useRef } from "react";
import CopyButton from "./CopyButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Trash2,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import DeleteZapModal from "./DeleteZapModal";
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
  deletionToken?: string;
};

export default function CustomizePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as CustomizePageState) || null;

  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [frameStyle, setFrameStyle] = useState<FrameOption>("none");
  const [logo, setLogo] = useState<string | null>(null);
  const [fgColor, setFgColor] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [tokenConfirmed, setTokenConfirmed] = useState(false);
  const [animateQR, setAnimateQR] = useState(false);

  const qrValue = state?.shortUrl || "https://zaplink.example.com/demo123";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setLogo(event.target.result as string);
      setAnimateQR(true);
      setTimeout(() => setAnimateQR(false), 400);
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
          padding: 24,
          background: "hsl(var(--card))",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        };
      case "gradient":
        return {
          padding: 24,
          borderRadius: 20,
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
          boxShadow: "0 8px 32px hsl(var(--primary) / 0.3)",
        };
      case "border":
        return {
          padding: 24,
          borderRadius: 16,
          border: "3px solid hsl(var(--primary))",
          background: "hsl(var(--card))",
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

    const cleanup = () => URL.revokeObjectURL(svgUrl);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          toast.error("Failed to create canvas context.");
          return;
        }
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.download = `zaplink-qr-${state?.name || "code"}.png`;
        a.href = pngFile;
        a.click();
        toast.success("Your QR code has been downloaded successfully.");
      } catch {
        toast.error("Failed to generate QR image.");
      } finally {
        cleanup();
      }
    };

    img.onerror = () => {
      cleanup();
      toast.error("Failed to load QR image.");
    };

    img.src = svgUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      toast.success("Short link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = () => {
    if (!navigator.share) {
      toast.error("Sharing not supported");
      return;
    }
    navigator.share({ title: "My QR Code", url: qrValue });
  };

  const handleCopyToken = async () => {
    if (!state?.deletionToken) return;
    await navigator.clipboard.writeText(state.deletionToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleDeleteSuccess = () => {
    toast.success("Redirecting to home...");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="bg-card rounded-3xl shadow-lg p-6 sm:p-8 space-y-8 border border-border">

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full animate-pulse">
              Step 3 of 3
            </span>
            <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-primary via-primary/80 to-primary" />
            </div>
            <span className="text-xs sm:text-sm text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Ready!
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="flex justify-center">
              <div
                ref={qrRef}
                style={getFrameStyle()}
                className={`transition-all duration-300 ${
                  animateQR ? "scale-110" : "scale-100"
                }`}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={240}
                  bgColor="#fff"
                  fgColor={fgColor}
                  level="H"
                  includeMargin
                  imageSettings={
                    logo
                      ? { src: logo, width: 50, height: 50, excavate: true }
                      : undefined
                  }
                />
              </div>
            </div>

            <div className="space-y-6">
              <Label>Frame Style</Label>
              <Select value={frameStyle} onValueChange={(v) => setFrameStyle(v as FrameOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["none", "rounded", "circle", "shadow", "gradient", "border"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>QR Color</Label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />

              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoUpload}
              />

              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCopyLink}>
                  {copied ? <Check /> : <Copy />}
                  Copy Link
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <Link to="/upload" className="inline-flex items-center gap-2 text-muted-foreground">
            <ArrowLeft /> Back to Upload
          </Link>
        </div>

        {state?.zapId && (
          <DeleteZapModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            zapId={state.zapId}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </main>
    </div>
  );
}