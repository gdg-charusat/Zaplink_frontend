import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Shield, AlertTriangle, Home, Lock, Loader2 } from "lucide-react";
import { MockZapView } from "./MockZapView";

function getErrorMessage(errorParam: string | null) {
  if (!errorParam) return null;
  if (errorParam === "viewlimit")
    return "View limit exceeded. This file is no longer accessible.";
  if (errorParam === "expired")
    return "This link has expired. The file is no longer available.";
  if (errorParam === "notfound")
    return "This link does not exist or has expired.";
  if (errorParam === "incorrect_password")
    return "Incorrect password. Please try again.";
  return "An unexpected error occurred. Please try again later.";
}

function getErrorHeading(errorParam: string | null) {
  if (errorParam === "expired") return "Link Expired";
  if (errorParam === "viewlimit") return "View Limit Exceeded";
  if (errorParam === "notfound") return "Not Found";
  if (errorParam === "incorrect_password") return "Incorrect Password";
  return "Access Denied";
}

function getErrorIcon(errorParam: string | null) {
  if (errorParam === "expired") return AlertTriangle;
  if (errorParam === "viewlimit") return AlertTriangle;
  if (errorParam === "notfound") return AlertTriangle;
  if (errorParam === "incorrect_password") return Lock;
  return AlertTriangle;
}

export default function ViewZap() {
  const { shortId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    const errorMsg = getErrorMessage(errorParam);
    if (errorMsg) {
      if (errorParam === "incorrect_password") {
        setPasswordRequired(true);
        setPasswordError(errorMsg);
        setLoading(false);
        return;
      }
      setError(errorMsg);
      setErrorType(errorParam);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }
    const fetchZap = async () => {
      setLoading(true);
      setError(null);
      setErrorType(null);
      setPasswordRequired(false);
      setPasswordError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`
        );
        // If successful, the backend will redirect or serve the file.
        if (response.data) {
          window.location.href = response.data.url;
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response?.status === 401) {
          // Check if it's a password required error
          if (
            error.response.data?.message
              ?.toLowerCase()
              .includes("password required")
          ) {
            setPasswordRequired(true);
            setLoading(false);
            return;
          } else if (
            error.response.data?.message
              ?.toLowerCase()
              .includes("incorrect password")
          ) {
            setPasswordError("Incorrect password. Please try again.");
            setPasswordRequired(true);
            setLoading(false);
            return;
          }
        } else if (error.response?.status === 410) {
          setError("This link has expired. The file is no longer available.");
          setErrorType("expired");
          toast.error(
            "This link has expired. The file is no longer available."
          );
        } else if (error.response?.status === 404) {
          setError("This link does not exist or has expired.");
          setErrorType("notfound");
          toast.error("This link does not exist or has expired.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
          setErrorType(null);
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchZap();
  }, [shortId, location.search]);

  useEffect(() => {
    if (passwordRequired) {
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, passwordRequired: true },
      });
    }
    // eslint-disable-next-line
  }, [passwordRequired]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`,
        {
          params: { password },
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Handle successful response
      if (response.data) {
        const { type, url, content, data, name } = response.data;

        if (
          type === "redirect" ||
          type === "file" ||
          type === "pdf" ||
          type === "video" ||
          type === "audio"
        ) {
          // Redirect to the URL
          window.location.href = url;
        } else if (type === "text" || type === "document") {
          // Escape HTML entities for security
          const escapeHtml = (unsafe: string) =>
            unsafe
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
          const escapedContent = escapeHtml(content);
          const escapedName = escapeHtml(name || "Untitled");
          // Use the backend's dark theme template
          const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${escapedName}</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #e5e7eb;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #111827;
                        min-height: 100vh;
                    }
                    .container {
                        background: #1f2937;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        border: 1px solid #374151;
                    }
                    h1 {
                        color: #f9fafb;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #3b82f6;
                        padding-bottom: 10px;
                        font-size: 2rem;
                        font-weight: 600;
                    }
                    .content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-size: 16px;
                        color: #d1d5db;
                        line-height: 1.7;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #374151;
                        text-align: center;
                        color: #9ca3af;
                        font-size: 14px;
                    }
                    @media (max-width: 768px) {
                        body {
                            padding: 15px;
                        }
                        .container {
                            padding: 20px;
                        }
                        h1 {
                            font-size: 1.5rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${escapedName}</h1>
                    <div class="content">${escapedContent}</div>
                    <div class="footer">
                        Powered by ZapLink
                    </div>
                </div>
            </body>
            </html>
          `;
          const newWindow = window.open("", "_blank");
          if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
          }
        } else if (type === "image") {
          // Display image
          const newWindow = window.open("", "_blank");
          if (newWindow) {
            newWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>${name || "Image"}</title>
              </head>
              <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                <img src="${data}" alt="${name || "Image"}" style="max-width: 100%; max-height: 100vh;">
              </body>
              </html>
            `);
            newWindow.document.close();
          }
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data?.message?.toLowerCase().includes("incorrect password")
      ) {
        setPasswordError("Incorrect password. Please try again.");
      } else if (
        error.response &&
        error.response.status === 401 &&
        error.response.data?.message?.toLowerCase().includes("password required")
      ) {
        setPasswordError("Password required.");
      } else if (
        error.response &&
        (error.response.status === 410 || error.response.status === 403)
      ) {
        setError("View limit exceeded. This file is no longer accessible.");
        setErrorType("viewlimit");
        toast.error("View limit exceeded. This file is no longer accessible.");
      } else if (error.response && error.response.status === 404) {
        setError("This link does not exist or has expired.");
        setErrorType("notfound");
        toast.error("This link does not exist or has expired.");
      } else {
        setPasswordError(
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full loading-spinner mx-auto mb-6"></div>
          <div className="text-lg text-muted-foreground">
            Loading your content...
          </div>
        </div>
      </div>
    );
  }

  // Show mock view for demo items
  if (shortId?.startsWith("mock")) {
    return <MockZapView shortId={shortId} />;
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-card rounded-3xl shadow-lg p-10 border border-border max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Password Protected
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            This content is secured. Please enter the password to continue.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-focus text-base rounded-xl border-border bg-background h-14 px-6 font-medium text-lg focus-ring"
              disabled={verifying}
              autoFocus
            />
            {passwordError && (
              <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                {passwordError}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-ring"
              disabled={verifying || !password}
            >
              {verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-3" />
                  Unlock Content
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    const ErrorIcon = getErrorIcon(errorType);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-card rounded-3xl shadow-lg p-10 border border-border max-w-md w-full text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ErrorIcon className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {getErrorHeading(errorType)}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">{error}</p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] h-14 px-8 text-lg focus-ring"
          >
            <Home className="h-5 w-5 mr-3" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // If no error and not loading, the backend should have redirected or served the file.
  return null;
}