import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Shield, AlertTriangle, Home, Lock, Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

/* ================= HELPERS ================= */

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
  if (
    errorParam === "expired" ||
    errorParam === "viewlimit" ||
    errorParam === "notfound"
  )
    return AlertTriangle;
  if (errorParam === "incorrect_password") return Lock;
  return AlertTriangle;
}

/* ================= COMPONENT ================= */

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

  /* ================= FETCH LOGIC ================= */

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    const errorMsg = getErrorMessage(errorParam);

    if (errorMsg) {
      if (errorParam === "incorrect_password") {
        setPasswordRequired(true);
        setPasswordError(errorMsg);
      } else {
        setError(errorMsg);
        setErrorType(errorParam);
        toast.error(errorMsg);
      }
      setLoading(false);
      return;
    }

    const fetchZap = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`
        );


        if (response.data?.url) {

        // If successful, the backend will redirect or serve the file.
        if (response.data && response.data.url) {

          window.location.href = response.data.url;
        } else {
          setError("File URL not available.");
          setLoading(false);
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        if (error.response?.status === 401) {
          if (
            error.response.data?.message
              ?.toLowerCase()
              .includes("password required")
          ) {
            setPasswordRequired(true);
          } else {
            setPasswordError("Incorrect password. Please try again.");
            setPasswordRequired(true);
          }
        } else if (error.response?.status === 410) {
          setError("This link has expired. The file is no longer available.");
          setErrorType("expired");
        } else if (error.response?.status === 404) {
          setError("This link does not exist or has expired.");
          setErrorType("notfound");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchZap();
  }, [shortId, location.search]);

  /* ================= PASSWORD SUBMIT ================= */

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`,
        { params: { password } }
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setPasswordError("Something went wrong. Try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  /* ================= RENDER STATES ================= */

  // 🔹 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="bg-card rounded-3xl shadow-lg p-10 border border-border max-w-md w-full space-y-6">
          <Skeleton className="w-20 h-20 rounded-3xl mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full mx-auto" />
          <Skeleton className="h-5 w-5/6 mx-auto" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // 🔹 Password Required
  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="bg-card rounded-3xl shadow-lg p-10 border border-border max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-4">
            Password Protected
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={verifying}
            />

            {passwordError && (
              <p className="text-destructive text-sm">{passwordError}</p>
            )}

            <Button type="submit" disabled={verifying || !password}>
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // 🔹 Error
  if (error) {
    const ErrorIcon = getErrorIcon(errorType);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="bg-card rounded-3xl shadow-lg p-10 border border-border max-w-md w-full text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ErrorIcon className="h-10 w-10 text-destructive" />
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {getErrorHeading(errorType)}
          </h2>

          <p className="mb-6 text-muted-foreground">{error}</p>

          <Button onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // 🔹 Success fallback (prevents blank screen)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}