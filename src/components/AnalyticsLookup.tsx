import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BarChart3, Search, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const AnalyticsLookup: React.FC = () => {
  const [shortId, setShortId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shortId.trim()) {
      toast.error("Please enter a Zap Short ID");
      return;
    }

    // Navigate to analytics page
    navigate(`/zaps/${shortId.trim()}/analytics`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">View Zap Analytics</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter a Zap Short ID to view detailed access statistics and insights
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="shortId" className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Zap Short ID
              </label>
              <Input
                id="shortId"
                type="text"
                placeholder="e.g., abc123"
                value={shortId}
                onChange={(e) => setShortId(e.target.value)}
                className="h-12 text-base rounded-xl focus-ring"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                The Short ID is the last part of your Zap URL (e.g., zaplink.com/zaps/<strong>abc123</strong>)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-base rounded-xl transition-all duration-300 hover:scale-[1.02] focus-ring"
            >
              <Search className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </form>

          <div className="pt-4 border-t border-border">
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                What you'll see:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Total views and unique visitors</li>
                <li>Device, browser, and OS breakdown</li>
                <li>Access timestamps and IP addresses</li>
                <li>Visitor activity timeline</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsLookup;
