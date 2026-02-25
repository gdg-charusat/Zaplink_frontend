import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { viewZap, type ApiError } from "../services/api";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Shield, AlertTriangle, Home, Lock, Loader2 } from "lucide-react";
import AccessQuiz from "./AccessQuiz";
import DelayedAccess from "./DelayedAccess";
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
  if (errorParam === "quiz_required")
    return "This file requires a quiz answer to access.";
  if (errorParam === "quiz_incorrect")
    return "Incorrect quiz answer. Please try again.";
  if (errorParam === "delayed_access")
    return "This file is temporarily locked and will be available later.";
  return "An unexpected error occurred. Please try again later.";
}

function getErrorHeading(errorParam: string | null) {
  if (errorParam === "expired") return "Link Expired";
  if (errorParam === "viewlimit") return "View Limit Exceeded";
  if (errorParam === "notfound") return "Not Found";
  if (errorParam === "incorrect_password") return "Incorrect Password";
  if (errorParam === "quiz_required") return "Quiz Required";
  if (errorParam === "quiz_incorrect") return "Incorrect Answer";
  if (errorParam === "delayed_access") return "File Locked";
  return "Access Denied";
}

function getErrorIcon(errorParam: string | null) {
  if (
    errorParam === "expired" ||
    errorParam === "viewlimit" ||
    errorParam === "notfound"
  )
    return AlertTriangle;
  if (
    errorParam === "incorrect_password" ||
    errorParam === "quiz_required" ||
    errorParam === "quiz_incorrect"
  )
    return Lock;
  if (errorParam === "delayed_access") return AlertTriangle;
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

  // ── Quiz States
  const [quizRequired, setQuizRequired] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState<string | null>(null);

  // ── Delayed Access States
  const [delayedAccessLocked, setDelayedAccessLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState<Date | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");

    if (errorParam === "quiz_required") {
      const question = params.get("question");
      if (question) {
        setQuizRequired(true);
        setQuizQuestion(decodeURIComponent(question));
        setLoading(false);
        return;
      }
    }

    if (errorParam === "delayed_access") {
      const unlockTimeStr = params.get("unlockTime");
      if (unlockTimeStr) {
        setDelayedAccessLocked(true);
        setUnlockTime(new Date(unlockTimeStr));
        setLoading(false);
        return;
      }
    }

    const errorMsg = getErrorMessage(errorParam);
    if (errorMsg) {
      if (errorParam === "quiz_incorrect") {
        const question = params.get("question");
        if (question) {
          setQuizRequired(true);
          setQuizQuestion(decodeURIComponent(question));
          toast.error("Incorrect answer. Please try again.");
          setLoading(false);
          return;
        }
      }

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
        if (!shortId) {
          setError("Invalid link.");
          setLoading(false);
          return;
        }

        const response = await viewZap(shortId);
        if (response?.url) {
          window.location.href = response.url;
          return;
        }

        setError("File URL not available.");
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError<{
          message: string;
          error: string;
          question?: string;
          unlockTime?: string;
        }>;

        if (error.response?.status === 423) {
          const message = error.response.data?.message || "";

          if (error.response.data?.error === "quiz_required") {
            setQuizRequired(true);
            setQuizQuestion(error.response.data?.question || null);
            setLoading(false);
            return;
          }

          let unlockedAt: Date | null = null;

          if (error.response.data?.unlockTime) {
            unlockedAt = new Date(error.response.data.unlockTime);
          } else {
            const isoMatch = message.match(
              /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?)/
            );
            if (isoMatch) {
              unlockedAt = new Date(isoMatch[1]);
            }
          }

          if (unlockedAt) {
            setDelayedAccessLocked(true);
            setUnlockTime(unlockedAt);
            setLoading(false);
            return;
          }
        }

        const apiError = err as ApiError;

        if (apiError.status === 401) {
          if (apiError.message?.toLowerCase().includes("password required")) {
            setPasswordRequired(true);
            setLoading(false);
            return;
          }
          if (apiError.message?.toLowerCase().includes("incorrect password")) {
            setPasswordError("Incorrect password. Please try again.");
            setPasswordRequired(true);
            setLoading(false);
            return;
          }
        } else if (apiError.status === 410) {
          setError("This link has expired. The file is no longer available.");
          setErrorType("expired");
          toast.error("This link has expired. The file is no longer available.");
        } else if (apiError.status === 404) {
          setError("This link does not exist or has expired.");
          setErrorType("notfound");
          toast.error("This link does not exist or has expired.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
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
  }, [passwordRequired]);

  const handleQuizCorrect = (zapData: { url?: string }) => {
    if (zapData?.url) {
      window.location.href = zapData.url;
      return;
    }
    window.location.reload();
  };

  const handleFileUnlocked = () => {
    window.location.reload();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError(null);

    try {
      if (!shortId) {
        setPasswordError("Invalid link.");
        return;
      }

      const apiUrl = import.meta.env.VITE_BACKEND_URL
        ? `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`
        : `/api/zaps/${shortId}`;

      const response = await axios.get(apiUrl, {
        params: { password },
        headers: { Accept: "application/json" },
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      const error = err as ApiError;

      if (error.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setPasswordError("An unexpected error occurred.");
      }
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (quizRequired && quizQuestion) {
    return (
      <AccessQuiz
        shortId={shortId || ""}
        question={quizQuestion}
        onQuizCorrect={handleQuizCorrect}
      />
    );
  }

  if (delayedAccessLocked && unlockTime) {
    return (
      <DelayedAccess unlockTime={unlockTime} onUnlocked={handleFileUnlocked} />
    );
  }

  if (shortId?.startsWith("mock")) {
    return <MockZapView shortId={shortId} />;
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-card p-10 rounded-3xl border border-border max-w-md w-full space-y-6"
        >
          <Shield className="h-10 w-10 text-primary mx-auto" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {passwordError && <p className="text-destructive">{passwordError}</p>}
          <Button type="submit" disabled={verifying}>
            {verifying ? "Verifying..." : "Unlock"}
          </Button>
        </form>
      </div>
    );
  }

  if (error) {
    const ErrorIcon = getErrorIcon(errorType);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="bg-card p-10 rounded-3xl border border-border text-center">
          <ErrorIcon className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{getErrorHeading(errorType)}</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button className="mt-6" onClick={() => (window.location.href = "/")}>
            <Home className="mr-2 h-4 w-4" /> Go Home
          </Button>
        </div>
      </div>
    );
  }

  return null;
}