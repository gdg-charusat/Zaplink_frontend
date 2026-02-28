import { useState, useEffect } from "react";
import {
  FileText,
  Link,
  Lock,
  Clock,
  Eye,
  HelpCircle,
  Zap,
  AlertCircle,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface QRScanPreviewProps {
  name?: string;
  type?: string;
  destinationUrl?: string;
  hasPassword?: boolean;
  viewLimit?: number;
  currentViews?: number;
  expiresAt?: string;
  quizQuestion?: string;
  unlockAt?: string;
}

export default function QRScanPreview({
  name = "Untitled Zap",
  type = "UNIVERSAL",
  destinationUrl,
  hasPassword = false,
  viewLimit,
  currentViews = 0,
  expiresAt,
  quizQuestion,
  unlockAt,
}: QRScanPreviewProps) {
  const [previewState, setPreviewState] = useState<string>("loading");
  const [timeUntilUnlock, setTimeUntilUnlock] = useState<string>("");

  useEffect(() => {
    // Determine preview state based on security settings and status
    if (unlockAt) {
      const unlockTime = new Date(unlockAt).getTime();
      const now = Date.now();
      
      if (now < unlockTime) {
        setPreviewState("locked");
        updateTimeUntilUnlock(unlockTime);
        return;
      }
    }

    if (expiresAt) {
      const expireTime = new Date(expiresAt).getTime();
      if (Date.now() > expireTime) {
        setPreviewState("expired");
        return;
      }
    }

    if (viewLimit && currentViews >= viewLimit) {
      setPreviewState("viewlimit");
      return;
    }

    if (quizQuestion) {
      setPreviewState("quiz");
      return;
    }

    if (hasPassword) {
      setPreviewState("password");
      return;
    }

    setPreviewState("ready");
  }, [expiresAt, viewLimit, currentViews, quizQuestion, hasPassword, unlockAt]);

  const updateTimeUntilUnlock = (unlockTime: number) => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = unlockTime - now;

      if (diff <= 0) {
        setPreviewState("ready");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeUntilUnlock(
        `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  };

  const getTypeIcon = (zapType: string) => {
    const upperType = zapType?.toUpperCase() || "UNIVERSAL";
    switch (upperType) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "IMAGE":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "VIDEO":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "AUDIO":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "URL":
        return <Link className="h-5 w-5 text-cyan-500" />;
      case "TEXT":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <Zap className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTypeLabel = (zapType: string) => {
    const upperType = zapType?.toUpperCase() || "UNIVERSAL";
    const typeMap: Record<string, string> = {
      PDF: "PDF Document",
      IMAGE: "Image File",
      VIDEO: "Video File",
      AUDIO: "Audio File",
      URL: "Web Link",
      TEXT: "Text Content",
      WORD: "Word Document",
      PPT: "Presentation",
      ZIP: "Archive",
      UNIVERSAL: "File",
    };
    return typeMap[upperType] || "File";
  };

  const renderPreviewContent = () => {
    switch (previewState) {
      case "loading":
        return (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-primary/50 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Analyzing QR content...</p>
          </div>
        );

      case "ready":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-200">
                  Ready to Share!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Users can scan this QR code immediately
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="mt-1">{getTypeIcon(type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Content Type</p>
                  <p className="font-medium truncate">{getTypeLabel(type)}</p>
                </div>
              </div>

              {destinationUrl && (
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Link className="h-5 w-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium text-sm truncate" title={destinationUrl}>
                      {destinationUrl}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium truncate">{name}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">
                  Password Protected
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Users will be prompted to enter a password
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Lock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Security</p>
                  <p className="font-medium">Password Required</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="mt-1">{getTypeIcon(type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Content Type</p>
                  <p className="font-medium truncate">{getTypeLabel(type)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium truncate">{name}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
              <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-purple-900 dark:text-purple-200">
                  Quiz Protection
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Users must answer a quiz question to access
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <HelpCircle className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Quiz Question</p>
                  <p className="font-medium text-sm">{quizQuestion}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="mt-1">{getTypeIcon(type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Content Type</p>
                  <p className="font-medium truncate">{getTypeLabel(type)}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "locked":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Delayed Access
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Content is temporarily locked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Timer className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Available In</p>
                  <p className="font-mono font-semibold text-sm">{timeUntilUnlock}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Unlock Time</p>
                  <p className="font-medium text-sm">
                    {unlockAt ? new Date(unlockAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">
                  Link Expired
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This link is no longer accessible
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Expired At</p>
                <p className="font-medium text-sm">
                  {expiresAt ? new Date(expiresAt).toLocaleString() : "-"}
                </p>
              </div>
            </div>
          </div>
        );

      case "viewlimit":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">
                  View Limit Reached
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Maximum views have been exceeded
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Eye className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">View Status</p>
                <p className="font-medium text-sm">
                  {currentViews} / {viewLimit} views
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSecurityBadges = () => {
    const badges = [];

    if (hasPassword) {
      badges.push(
        <div
          key="password"
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
        >
          <Lock className="h-3 w-3" />
          Password
        </div>
      );
    }

    if (quizQuestion) {
      badges.push(
        <div
          key="quiz"
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
        >
          <HelpCircle className="h-3 w-3" />
          Quiz
        </div>
      );
    }

    if (viewLimit) {
      badges.push(
        <div
          key="viewlimit"
          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium"
        >
          <Eye className="h-3 w-3" />
          {currentViews}/{viewLimit} views
        </div>
      );
    }

    if (expiresAt) {
      const isExpiringSoon =
        new Date(expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;
      badges.push(
        <div
          key="expires"
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            isExpiringSoon
              ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
              : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
          }`}
        >
          <Clock className="h-3 w-3" />
          {isExpiringSoon ? "Expires soon" : "Has expiry"}
        </div>
      );
    }

    if (unlockAt) {
      badges.push(
        <div
          key="unlock"
          className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium"
        >
          <Timer className="h-3 w-3" />
          Delayed
        </div>
      );
    }

    return badges.length > 0 ? (
      <div className="flex flex-wrap gap-2">{badges}</div>
    ) : null;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>QR Scan Preview</Label>
        <p className="text-xs text-muted-foreground">
          This is what users will see when they scan your QR code
        </p>
      </div>

      <Card className="p-6 space-y-4 border border-border bg-card">
        {renderPreviewContent()}
      </Card>

      {renderSecurityBadges() && (
        <div className="space-y-2">
          <Label className="text-xs">Security Settings</Label>
          {renderSecurityBadges()}
        </div>
      )}
    </div>
  );
}
