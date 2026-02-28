import React, { useState } from "react";
import { saveRecentLink } from "../utils/recentLinks";
import { type RecentLink } from "../types/recentLink";
import RecentLinks from "../components/RecentLinks";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LinkIcon, Check, Copy } from "lucide-react";

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    qrCode: string;
    originalUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^https?:\/\/.*/.test(url)) {
      toast.error("Please enter a valid http:// or https:// URL");
      return;
    }

    setLoading(true);

    const res = await fetch("YOUR_BACKEND_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    setResult(data);

    const newLink: RecentLink = {
      id: Date.now(),
      url: data.shortUrl,
      createdAt: new Date().toISOString(),
    };

    saveRecentLink(newLink);

    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md bg-card/50 rounded-2xl shadow-xl p-8 border border-border/30">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 rounded-full p-4 mb-3">
            <LinkIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center">URL Shortener</h1>
          <p className="text-muted-foreground text-center text-sm">
            Shorten any URL including web links, data URIs, and more. No login
            required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter any URL (http://, data:, etc.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Shortening..." : "Shorten & Generate QR"}
          </Button>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-center">
              <img
                src={result.qrCode}
                alt="QR Code"
                className="w-48 h-48 border-2 border-border/50 rounded-lg p-2 bg-white"
              />
            </div>

            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Short Link:
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline break-all flex-1 hover:opacity-80 transition-opacity"
                  >
                    {result.shortUrl}
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-border/30">
                <p className="text-xs font-medium text-muted-foreground">
                  Original URL:
                </p>
                <p className="text-xs break-all text-muted-foreground/80">
                  {result.originalUrl}
                </p>
              </div>
            </div>
          </div>
        )}
        <RecentLinks />
      </div>
    </div>
  );
}
