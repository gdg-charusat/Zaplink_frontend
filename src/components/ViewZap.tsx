import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Shield, AlertTriangle, Home, Lock, Loader2 } from "lucide-react";

function logAnalytics(shortId: string) {
  const deviceType = /Mobi|Android/i.test(navigator.userAgent)
    ? "Mobile"
    : /Tablet|iPad/i.test(navigator.userAgent)
    ? "Tablet"
    : "Desktop";

  const browser = (() => {
    if (navigator.userAgent.includes("Chrome")) return "Chrome";
    if (navigator.userAgent.includes("Safari")) return "Safari";
    if (navigator.userAgent.includes("Edge")) return "Edge";
    if (navigator.userAgent.includes("Firefox")) return "Firefox";
    return "Other";
  })();

  const newLog = {
    timestamp: new Date().toISOString(),
    device: deviceType,
    browser,
  };

  const existing = JSON.parse(
    localStorage.getItem(`zap_analytics_${shortId}`) || "[]"
  );

  existing.push(newLog);

  localStorage.setItem(
    `zap_analytics_${shortId}`,
    JSON.stringify(existing)
  );
}

export default function ViewZap() {
  const { shortId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZap = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`
        );

        if (response.data && shortId) {
          logAnalytics(shortId);
          window.location.href = response.data.url;
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        if (error.response?.status === 401) {
          setPasswordRequired(true);
        } else if (error.response?.status === 410) {
          setError("This link has expired.");
        } else if (error.response?.status === 404) {
          setError("This link does not exist.");
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchZap();
  }, [shortId]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`,
        { params: { password } }
      );

      if (response.data && shortId) {
        logAnalytics(shortId);
        window.location.href = response.data.url;
      }
    } catch {
      setPasswordError("Incorrect password.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (passwordRequired)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <Button type="submit" disabled={verifying}>
            {verifying ? "Verifying..." : "Unlock"}
          </Button>
        </form>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>{error}</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );

  return null;
}