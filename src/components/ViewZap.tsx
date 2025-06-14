import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function getErrorMessage(errorParam: string | null) {
  if (!errorParam) return null;
  if (errorParam === "viewlimit")
    return "View limit exceeded. This file is no longer accessible.";
  if (errorParam === "expired")
    return "This link has expired. The file is no longer available.";
  if (errorParam === "notfound")
    return "This link does not exist or has expired.";
  return "An unexpected error occurred. Please try again later.";
}

function getErrorHeading(errorParam: string | null) {
  if (errorParam === "expired") return "Link Expired";
  if (errorParam === "viewlimit") return "View Limit Exceeded";
  if (errorParam === "notfound") return "Not Found";
  return "Access Denied";
}

export default function ViewZap() {
  const { shortId } = useParams();
  const location = useLocation();
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
        await axios.get(`/api/zaps/${shortId}`);
        // If successful, the backend will redirect or serve the file.
      } catch (err: any) {
        if (
          err.response &&
          err.response.status === 401 &&
          err.response.data?.message
            ?.toLowerCase()
            .includes("password required")
        ) {
          setPasswordRequired(true);
        } else if (
          err.response &&
          err.response.status === 401 &&
          err.response.data?.message
            ?.toLowerCase()
            .includes("incorrect password")
        ) {
          setPasswordRequired(true);
          setPasswordError("Incorrect password. Please try again.");
        } else if (
          err.response &&
          (err.response.status === 410 || err.response.status === 403)
        ) {
          setError("View limit exceeded. This file is no longer accessible.");
          setErrorType("viewlimit");
          toast.error(
            "View limit exceeded. This file is no longer accessible."
          );
        } else if (err.response && err.response.status === 404) {
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
    // eslint-disable-next-line
  }, [shortId, location.search]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError(null);
    try {
      await axios.get(`/api/zaps/${shortId}`, {
        params: { password },
      });
      // If successful, the backend will redirect or serve the file.
      // Optionally, you can show a spinner or "Redirecting..." message here.
      setPasswordError(null);
      setPasswordRequired(false);
      setVerifying(false);
      setLoading(true);
      window.location.reload(); // Try to reload to trigger backend redirect
    } catch (err: any) {
      if (
        err.response &&
        err.response.status === 401 &&
        err.response.data?.message?.toLowerCase().includes("incorrect password")
      ) {
        setPasswordError("Incorrect password. Please try again.");
      } else if (
        err.response &&
        err.response.status === 401 &&
        err.response.data?.message?.toLowerCase().includes("password required")
      ) {
        setPasswordError("Password required.");
      } else if (
        err.response &&
        (err.response.status === 410 || err.response.status === 403)
      ) {
        setError("View limit exceeded. This file is no longer accessible.");
        setErrorType("viewlimit");
        toast.error("View limit exceeded. This file is no longer accessible.");
      } else if (err.response && err.response.status === 404) {
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
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Password Required
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
              disabled={verifying}
              autoFocus
            />
            {passwordError && (
              <div className="text-red-600 text-sm">{passwordError}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={verifying || !password}
            >
              {verifying ? "Verifying..." : "Unlock"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {getErrorHeading(errorType)}
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => (window.location.href = "/")} className="mt-2">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // If no error and not loading, the backend should have redirected or served the file.
  return null;
}
