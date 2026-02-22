import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Eye, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface MockZapViewProps {
  shortId: string;
}

export function MockZapView({ shortId }: MockZapViewProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  // Extract index from shortId like "mock133"
  const index = parseInt(shortId.replace("mock", ""), 10) || 1;

  const types = [
    "pdf",
    "image",
    "video",
    "audio",
    "url",
    "text",
    "document",
    "presentation",
  ];
  const type = types[(index - 1) % types.length];

  const typeColors: Record<string, { bg: string; text: string; label: string }> = {
    pdf: { bg: "bg-red-500/20", text: "text-red-400", label: "PDF" },
    image: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Image" },
    video: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Video" },
    audio: { bg: "bg-pink-500/20", text: "text-pink-400", label: "Audio" },
    url: { bg: "bg-green-500/20", text: "text-green-400", label: "URL" },
    text: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Text" },
    document: { bg: "bg-indigo-500/20", text: "text-indigo-400", label: "Document" },
    presentation: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      label: "Presentation",
    },
  };

  const color = typeColors[type] || typeColors.pdf;
  const createdAt = new Date(Date.now() - (index - 1) * 60_000);
  const relativeTime = index === 1 ? "just now" : `${index}m ago`;
  const mockUrl = `https://example.com/demo-${index}`;
  const viewCount = (index * 3) % 120;

  const handleCopy = () => {
    navigator.clipboard.writeText(mockUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="flex-1 font-semibold text-foreground">
            Demo Zap {index}
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Demo Item</p>
                <h1 className="text-4xl font-bold text-foreground">
                  Demo Zap {index}
                </h1>
              </div>
              <div className={cn("px-4 py-2 rounded-lg", color.bg)}>
                <span className={cn("text-sm font-semibold", color.text)}>
                  {color.label}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="h-4 w-4" />
                {relativeTime}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Views</p>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Eye className="h-4 w-4" />
                {viewCount}/200
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="text-sm font-medium text-foreground">
                {color.label}
              </p>
            </div>
          </div>

          {/* URL Section */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Shareable URL</h2>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <input
                type="text"
                readOnly
                value={mockUrl}
                className="flex-1 bg-transparent text-sm text-foreground outline-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <p className="text-sm text-foreground">
              <strong>This is a demo item</strong> from mock data. In production,
              this would show the actual shared file or link. Click{" "}
              <strong>Back</strong> to return to dashboard.
            </p>
          </div>

          {/* Action */}
          <div className="flex gap-4">
            <Button onClick={() => navigate(-1)} variant="outline" className="flex-1">
              Back to My Zaps
            </Button>
            <Button onClick={() => navigate("/")} className="flex-1">
              Create New Zap
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
