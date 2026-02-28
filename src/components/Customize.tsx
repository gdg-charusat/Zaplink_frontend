import { useState, useRef } from "react";
import CopyButton from "./CopyButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  Copy,
  Share2,
  Check,
  BarChart3,
  Trash2,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  PackageOpen,
  Sparkles,
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

import FormatSelector from "./export/FormatSelector";
import ResolutionSelector from "./export/ResolutionSelector";
import ExportPreview from "./export/ExportPreview";
import type { ExportFormat } from "../lib/qr-export";
import { exportQRCode, batchExport } from "../lib/qr-export";
import QRScanPreview from "./QRScanPreview";

/* ================= TYPES ================= */

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
  hasPassword?: boolean;
  viewLimit?: number;
  expiresAt?: string;
  quizQuestion?: string;
  unlockAt?: string;
  originalUrl?: string;
};

/* ================= COMPONENT ================= */

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

  /* ---- Multi-format export (PR feature) ---- */
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportResolution, setExportResolution] = useState(1000);
  const [exportQuality, setExportQuality] = useState(85);
  const [isExporting, setIsExporting] = useState(false);

  const qrValue = state?.shortUrl || "https://zaplink.example.com/demo123";

  /* ================= HANDLERS ================= */

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

  const handleDownload = async () => {
    if (!qrRef.current) return;
    setIsExporting(true);
    try {
      await exportQRCode(qrRef.current, {
        format: exportFormat,
        resolution: exportResolution,
        quality: exportQuality,
        includeFrame: frameStyle !== "none",
        includeLogo: !!logo,
        fileName: `zaplink-qr-${state?.name || "code"}`,
      });
      toast.success(`QR exported as ${exportFormat.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBatchDownload = async () => {
    if (!qrRef.current) return;
    setIsExporting(true);
    try {
      await batchExport(
        qrRef.current,
        `zaplink-qr-${state?.name || "code"}`,
        exportResolution,
        exportQuality
      );
      toast.success("All formats downloaded");
    } catch {
      toast.error("Batch export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
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
    toast.success("Deletion token copied");
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleDeleteSuccess = () => {
    toast.success("Redirecting to home...");
    setTimeout(() => navigate("/"), 1000);
  };

  /* ================= UI ================= */

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
              <div className="progress-bar h-full w-full"></div>
            </div>
            <span className="text-xs sm:text-sm text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Ready!
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* QR Code Preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-muted/20 p-10 rounded-3xl border border-border">
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
            </div>

            {/* Scan Preview Panel */}
            <div className="lg:col-span-1">
              <QRScanPreview
                name={state?.name || "Untitled Zap"}
                type={state?.type || "UNIVERSAL"}
                destinationUrl={state?.originalUrl || state?.shortUrl}
                hasPassword={state?.hasPassword || false}
                viewLimit={state?.viewLimit}
                expiresAt={state?.expiresAt}
                quizQuestion={state?.quizQuestion}
                unlockAt={state?.unlockAt}
              />
            </div>

            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <Label>Frame Style</Label>
              <Select
                value={frameStyle}
                onValueChange={(v) => setFrameStyle(v as FrameOption)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["none", "rounded", "circle", "shadow", "gradient", "border"].map(
                    (v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Label>QR Color</Label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />

              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload Logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoUpload}
              />

              <FormatSelector
                value={exportFormat}
                onChange={setExportFormat}
              />
              <ResolutionSelector
                value={exportResolution}
                onChange={setExportResolution}
                disabled={exportFormat === "svg" || exportFormat === "pdf"}
              />
              <ExportPreview
                format={exportFormat}
                resolution={exportResolution}
                quality={exportQuality}
                onQualityChange={setExportQuality}
              />

              <Button onClick={handleDownload} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Download"}
              </Button>

              <Button
                variant="outline"
                onClick={handleBatchDownload}
                disabled={isExporting}
              >
                <PackageOpen className="mr-2 h-4 w-4" />
                Download All
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCopyLink}>
                  {copied ? <Check /> : <Copy />} Copy Link
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 /> Share
                </Button>
              </div>

              {state?.deletionToken && (
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Zap
                </Button>
              )}
              {/* Actions */}
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Actions</h2>
                </div>

                {/* Inline Short URL display with Copy button */}
                <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30">
                  <span
                    className="flex-1 truncate text-sm text-muted-foreground font-mono select-all"
                    title={qrValue}
                  >
                    {qrValue}
                  </span>
                  <CopyButton text={qrValue} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl focus-ring"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download QR Code
                  </Button>
                  <Link
                    to={`/zaps/${state?.shortUrl?.split('/').pop() || ''}/analytics`}
                    className="h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl focus-ring flex items-center justify-center"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    View Analytics
                  </Link>
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

                {/* Deletion Token Section */}
                {state?.deletionToken && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-500">
                            Save Your Deletion Token
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            This token is required to delete your Zap later. Save it
                            securely - you won't be able to retrieve it again!
                          </p>

                          {/* Token Display */}
                          <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border">
                            <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                            <code className="flex-1 text-xs font-mono break-all select-all">
                              {showToken
                                ? state.deletionToken
                                : "•".repeat(Math.min(state.deletionToken.length, 40))}
                            </code>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowToken(!showToken)}
                              className="h-8 w-8 flex-shrink-0"
                              title={showToken ? "Hide token" : "Show token"}
                            >
                              {showToken ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          {/* Token Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleCopyToken}
                              className="h-9 rounded-lg text-xs"
                            >
                              {tokenCopied ? (
                                <>
                                  <Check className="h-3 w-3 mr-1.5" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1.5" />
                                  Copy Token
                                </>
                              )}
                            </Button>
                            {!tokenConfirmed && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setTokenConfirmed(true);
                                  toast.success("Token confirmed! Keep it safe.");
                                }}
                                className="h-9 rounded-lg text-xs"
                              >
                                <Check className="h-3 w-3 mr-1.5" />
                                I've Saved It
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      onClick={() => setDeleteModalOpen(true)}
                      variant="destructive"
                      className="w-full h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete This Zap
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-muted-foreground"
          >
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