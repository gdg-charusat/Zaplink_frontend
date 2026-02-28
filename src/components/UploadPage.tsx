import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  Shield,
  Clock,
  Eye,
  Zap,
  FileText,
  Link,
  Type as TypeIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import FileUpload from "./FileUpload";

type FileType =
  | "image"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "audio"
  | "video"
  | "url"
  | "text";

const TYPE_MESSAGES: Record<FileType, string> = {
  image: "Supports: .jpg, .jpeg, .png, .webp",
  pdf: "Supports: .pdf only",
  document: "Supports: .doc, .docx, .txt, .rtf",
  spreadsheet: "Supports: .xls, .xlsx, .csv",
  presentation: "Supports: .ppt, .pptx",
  archive: "Supports: .zip, .rar, .7z, .tar, .gz",
  audio: "Supports: .mp3, .wav, .ogg, .m4a",
  video: "Supports: .mp4, .avi, .mov, .wmv, .flv",
  url: "Enter a valid http:// or https:// link",
  text: "Enter text content",
};

const TYPE_EXTENSIONS: Record<FileType, string[]> = {
  image: [".jpg", ".jpeg", ".png", ".webp"],
  pdf: [".pdf"],
  document: [".doc", ".docx", ".txt", ".rtf"],
  spreadsheet: [".xls", ".xlsx", ".csv"],
  presentation: [".ppt", ".pptx"],
  archive: [".zip", ".rar", ".7z", ".tar", ".gz"],
  audio: [".mp3", ".wav", ".ogg", ".m4a"],
  video: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
  url: [],
  text: [],
};

// Add a type for the form data hash function
interface FormDataHash {
  qrName: string;
  uploadedFile: File | null;
  passwordProtect: boolean;

  selfDestruct: boolean;
  destructViews: boolean;
  destructTime: boolean;
  viewsValue: string;
  timeValue: string;
  urlValue: string;
  textValue: string;
  type: string;
}

function getFormDataHash({
  qrName,
  uploadedFile,
  passwordProtect,
  selfDestruct,
  destructViews,
  destructTime,
  viewsValue,
  timeValue,
  urlValue,
  textValue,
  type,
}: Omit<FormDataHash, "password">) {
  return JSON.stringify({
    qrName,
    fileName: uploadedFile?.name || null,
    passwordProtect,
    selfDestruct,
    destructViews,
    destructTime,
    viewsValue,
    timeValue,
    urlValue,
    textValue,
    type,
  });
}

export default function UploadPage() {
  const location = useLocation();
  const initialType = (location.state?.type as FileType) || "pdf";
  const navigate = useNavigate();
  const [qrName, setQrName] = useState(
    () => sessionStorage.getItem("qrName") || ""
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState("");
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [destructViews, setDestructViews] = useState(() =>
    JSON.parse(sessionStorage.getItem("destructViews") || "false")
  );
  const [destructTime, setDestructTime] = useState(() =>
    JSON.parse(sessionStorage.getItem("destructTime") || "false")
  );
  const [viewsValue, setViewsValue] = useState(
    () => sessionStorage.getItem("viewsValue") || ""
  );
  const [timeValue, setTimeValue] = useState(
    () => sessionStorage.getItem("timeValue") || ""
  );
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<FileType>(initialType);
  const [urlValue, setUrlValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [compressPdf, setCompressPdf] = useState(false);
  const [enableDelayedAccess] = useState(false);
  const [delayedAccessValue] = useState("");
  const [delayedAccessType] = useState<"minutes" | "hours" | "days">("hours");
  const [enableAccessQuiz] = useState(false);
  const [quizQuestion] = useState("");
  const [lastQR, setLastQR] = useState(() => {
    const data = sessionStorage.getItem("lastQR");
    return data ? JSON.parse(data) : null;
  });
  const [lastQRFormHash, setLastQRFormHash] = useState(() => {
    const data = sessionStorage.getItem("lastQRFormHash");
    return data || null;
  });

  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("qrName", qrName);
  }, [qrName]);

  useEffect(() => {
    sessionStorage.setItem("passwordProtect", JSON.stringify(passwordProtect));
  }, [passwordProtect]);

  useEffect(() => {
    sessionStorage.setItem("selfDestruct", JSON.stringify(selfDestruct));
    if (!selfDestruct) {
      setDestructViews(false);
      setDestructTime(false);
      setViewsValue("");
      setTimeValue("");
    }
  }, [selfDestruct]);

  useEffect(() => {
    sessionStorage.setItem("destructViews", JSON.stringify(destructViews));
    if (!destructViews) setViewsValue("");
  }, [destructViews]);

  useEffect(() => {
    sessionStorage.setItem("destructTime", JSON.stringify(destructTime));
    if (!destructTime) setTimeValue("");
  }, [destructTime]);

  useEffect(() => {
    sessionStorage.setItem("viewsValue", viewsValue);
  }, [viewsValue]);

  useEffect(() => {
    sessionStorage.setItem("timeValue", timeValue);
  }, [timeValue]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  // Reset form state when file type changes
  useEffect(() => {
    setQrName("");
    setUploadedFile(null);
    setPasswordProtect(false);
    setPassword("");
    setSelfDestruct(false);
    setDestructViews(false);
    setDestructTime(false);
    setViewsValue("");
    setTimeValue("");
    setUrlValue("");
    setTextValue("");
    setCompressPdf(false);
  }, [type]);

  // After successful QR generation, store QR and form hash
  const handleGenerateAndContinue = async () => {
    // Validate self-destruct views
    if (selfDestruct && destructViews) {
      if (!viewsValue.trim() || isNaN(Number(viewsValue)) || Number(viewsValue) < 1) {
        toast.error("Invalid value for 'After Views'. Please enter a positive integer.");
        return;
      }
    }
    // Validate self-destruct time
    if (selfDestruct && destructTime) {
      if (!timeValue.trim() || isNaN(Number(timeValue)) || Number(timeValue) < 1) {
        toast.error("Invalid value for 'After Time'. Please enter a positive integer.");
        return;
      }
    }
    if (type === "url") {
      if (!urlValue || !/^https?:\/\//.test(urlValue)) {
        toast.error("Please enter a valid http:// or https:// link");
        return;
      }
      if (!qrName) {
        toast.error("Please enter a name for your QR code");
        return;
      }
      const formData = new FormData();
      formData.append("originalUrl", urlValue);
      formData.append("name", qrName);
      formData.append("type", "URL");
      if (passwordProtect && password.trim()) {
        formData.append("password", password);
      }
      if (selfDestruct && destructViews && viewsValue.trim()) {
        formData.append("viewLimit", viewsValue);
      }
      if (selfDestruct && destructTime && timeValue.trim()) {
        const expirationTime = new Date();
        const hours = parseInt(timeValue);
        if (!isNaN(hours)) {
          expirationTime.setTime(
            expirationTime.getTime() + hours * 60 * 60 * 1000
          );
          formData.append("expiresAt", expirationTime.toISOString());
        }
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
          formData
        );
        const { data } = response.data;

        const formHash = getFormDataHash({
          qrName,
          uploadedFile,
          passwordProtect,
          selfDestruct,
          destructViews,
          destructTime,
          viewsValue,
          timeValue,
          urlValue,
          textValue,
          type,
        });
        sessionStorage.setItem("lastQR", JSON.stringify({ ...data }));
        sessionStorage.setItem("lastQRFormHash", formHash);
        setLastQR({ ...data });
        setLastQRFormHash(formHash);

        toast.success("QR Code generated successfully!");
        // Calculate expiration timestamp
        let expiresAt: string | undefined;
        if (selfDestruct && destructTime && timeValue.trim()) {
          const expirationTime = new Date();
          const hours = parseInt(timeValue);
          if (!isNaN(hours)) {
            expirationTime.setTime(
              expirationTime.getTime() + hours * 60 * 60 * 1000,
            );
            expiresAt = expirationTime.toISOString();
          }
        }

        // Calculate unlock timestamp
        let unlockAt: string | undefined;
        if (
          enableDelayedAccess &&
          delayedAccessValue.trim() &&
          !isNaN(Number(delayedAccessValue))
        ) {
          const unlockTime = new Date();
          let delaySeconds = parseInt(delayedAccessValue);
          if (delayedAccessType === "hours") {
            delaySeconds *= 60 * 60;
          } else if (delayedAccessType === "days") {
            delaySeconds *= 24 * 60 * 60;
          } else if (delayedAccessType === "minutes") {
            delaySeconds *= 60;
          }
          unlockTime.setTime(unlockTime.getTime() + delaySeconds * 1000);
          unlockAt = unlockTime.toISOString();
        }

        navigate("/customize", {
          state: {
            zapId: data.zapId,
            shortUrl: data.shortUrl,
            qrCode: data.qrCode,
            type: data.type.toUpperCase(),
            name: data.name,
            deletionToken: data.deletionToken,
            hasPassword: passwordProtect && password.trim().length > 0,
            viewLimit: selfDestruct && destructViews && viewsValue.trim() ? parseInt(viewsValue) : undefined,
            expiresAt,
            quizQuestion: enableAccessQuiz && quizQuestion.trim() ? quizQuestion : undefined,
            unlockAt,
            originalUrl: urlValue || null,
          },
        });
      } catch (error: unknown) {
        let errorMessage = "Unknown error occurred";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(`Upload failed: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === "text") {
      if (!textValue.trim()) {
        toast.error("Please enter some text content");
        return;
      }
      if (!qrName) {
        toast.error("Please enter a name for your QR code");
        return;
      }
      const formData = new FormData();
      formData.append("textContent", textValue);
      formData.append("name", qrName);
      formData.append("type", "TEXT");
      if (passwordProtect && password.trim()) {
        formData.append("password", password);
      }
      if (selfDestruct && destructViews && viewsValue.trim()) {
        formData.append("viewLimit", viewsValue);
      }
      if (selfDestruct && destructTime && timeValue.trim()) {
        const expirationTime = new Date();
        const hours = parseInt(timeValue);
        if (!isNaN(hours)) {
          expirationTime.setTime(
            expirationTime.getTime() + hours * 60 * 60 * 1000
          );
          formData.append("expiresAt", expirationTime.toISOString());
        }
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
          formData
        );
        const { data } = response.data;

        const formHash = getFormDataHash({
          qrName,
          uploadedFile,
          passwordProtect,
          selfDestruct,
          destructViews,
          destructTime,
          viewsValue,
          timeValue,
          urlValue,
          textValue,
          type,
        });
        sessionStorage.setItem("lastQR", JSON.stringify({ ...data }));
        sessionStorage.setItem("lastQRFormHash", formHash);
        setLastQR({ ...data });
        setLastQRFormHash(formHash);

        toast.success("QR Code generated successfully!");
        // Calculate expiration timestamp
        let expiresAt2: string | undefined;
        if (selfDestruct && destructTime && timeValue.trim()) {
          const expirationTime = new Date();
          const hours = parseInt(timeValue);
          if (!isNaN(hours)) {
            expirationTime.setTime(
              expirationTime.getTime() + hours * 60 * 60 * 1000,
            );
            expiresAt2 = expirationTime.toISOString();
          }
        }

        // Calculate unlock timestamp
        let unlockAt2: string | undefined;
        if (
          enableDelayedAccess &&
          delayedAccessValue.trim() &&
          !isNaN(Number(delayedAccessValue))
        ) {
          const unlockTime = new Date();
          let delaySeconds = parseInt(delayedAccessValue);
          if (delayedAccessType === "hours") {
            delaySeconds *= 60 * 60;
          } else if (delayedAccessType === "days") {
            delaySeconds *= 24 * 60 * 60;
          } else if (delayedAccessType === "minutes") {
            delaySeconds *= 60;
          }
          unlockTime.setTime(unlockTime.getTime() + delaySeconds * 1000);
          unlockAt2 = unlockTime.toISOString();
        }

        navigate("/customize", {
          state: {
            zapId: data.zapId,
            shortUrl: data.shortUrl,
            qrCode: data.qrCode,
            type: data.type.toUpperCase(),
            name: data.name,
            deletionToken: data.deletionToken,
            hasPassword: passwordProtect && password.trim().length > 0,
            viewLimit: selfDestruct && destructViews && viewsValue.trim() ? parseInt(viewsValue) : undefined,
            expiresAt: expiresAt2,
            quizQuestion: enableAccessQuiz && quizQuestion.trim() ? quizQuestion : undefined,
            unlockAt: unlockAt2,
            originalUrl: null,
          },
        });
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          `Upload failed: ${err.response?.data?.message || err.message}`
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("name", qrName);
    formData.append("type", type.toUpperCase());
    if (passwordProtect && password.trim()) {
      formData.append("password", password);
    }
    if (selfDestruct && destructViews && viewsValue.trim()) {
      formData.append("viewLimit", viewsValue);
    }
    if (selfDestruct && destructTime && timeValue.trim()) {
      const expirationTime = new Date();
      const hours = parseInt(timeValue);
      if (!isNaN(hours)) {
        expirationTime.setTime(
          expirationTime.getTime() + hours * 60 * 60 * 1000
        );
        formData.append("expiresAt", expirationTime.toISOString());
      }
    }


    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
        formData
      );
      const { data } = response.data;

      const formHash = getFormDataHash({
        qrName,
        uploadedFile,
        passwordProtect,
        selfDestruct,
        destructViews,
        destructTime,
        viewsValue,
        timeValue,
        urlValue,
        textValue,
        type,
      });
      sessionStorage.setItem("lastQR", JSON.stringify({ ...data }));
      sessionStorage.setItem("lastQRFormHash", formHash);
      setLastQR({ ...data });
      setLastQRFormHash(formHash);

      toast.success("QR Code generated successfully!");
      // Calculate expiration timestamp
      let expiresAt3: string | undefined;
      if (selfDestruct && destructTime && timeValue.trim()) {
        const expirationTime = new Date();
        const hours = parseInt(timeValue);
        if (!isNaN(hours)) {
          expirationTime.setTime(
            expirationTime.getTime() + hours * 60 * 60 * 1000,
          );
          expiresAt3 = expirationTime.toISOString();
        }
      }

      // Calculate unlock timestamp
      let unlockAt3: string | undefined;
      if (
        enableDelayedAccess &&
        delayedAccessValue.trim() &&
        !isNaN(Number(delayedAccessValue))
      ) {
        const unlockTime = new Date();
        let delaySeconds = parseInt(delayedAccessValue);
        if (delayedAccessType === "hours") {
          delaySeconds *= 60 * 60;
        } else if (delayedAccessType === "days") {
          delaySeconds *= 24 * 60 * 60;
        } else if (delayedAccessType === "minutes") {
          delaySeconds *= 60;
        }
        unlockTime.setTime(unlockTime.getTime() + delaySeconds * 1000);
        unlockAt3 = unlockTime.toISOString();
      }

      navigate("/customize", {
        state: {
          zapId: data.zapId,
          shortUrl: data.shortUrl,
          qrCode: data.qrCode,
          type: data.type.toUpperCase(),
          name: data.name,
          deletionToken: data.deletionToken,
          hasPassword: passwordProtect && password.trim().length > 0,
          viewLimit: selfDestruct && destructViews && viewsValue.trim() ? parseInt(viewsValue) : undefined,
          expiresAt: expiresAt3,
          quizQuestion: enableAccessQuiz && quizQuestion.trim() ? quizQuestion : undefined,
          unlockAt: unlockAt3,
          originalUrl: null,
        },
      });
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        toast.info("Upload canceled by user");
        return;
      }
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        `Upload failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // On form input change, clear lastQR if form hash changes
  useEffect(() => {
    const formHash = getFormDataHash({
      qrName,
      uploadedFile,
      passwordProtect,
      selfDestruct,
      destructViews,
      destructTime,
      viewsValue,
      timeValue,
      urlValue,
      textValue,
      type,
    });
    if (lastQRFormHash && formHash !== lastQRFormHash) {
      sessionStorage.removeItem("lastQR");
      sessionStorage.removeItem("lastQRFormHash");
      setLastQR(null);
      setLastQRFormHash(null);
    }
  }, [
    qrName,
    uploadedFile,
    passwordProtect,
    selfDestruct,
    destructViews,
    destructTime,
    viewsValue,
    timeValue,
    urlValue,
    textValue,
    type,
    lastQRFormHash,
  ]);

  const handlePasswordProtectChange = (checked: boolean | "indeterminate") => {
    setPasswordProtect(checked === true);
  };

  const handleSelfDestructChange = (checked: boolean | "indeterminate") => {
    setSelfDestruct(checked === true);
  };

  const handleViewsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setViewsValue(value);
    }
  };

  const handleTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setTimeValue(value);
    }
  };

  // Add file size constraints
  const MAX_SIZE_MB = type === "video" ? 100 : 10;

  // Handle files from the FileUpload component
  const handleFilesFromUploader = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(
        `${type.charAt(0).toUpperCase() + type.slice(1)
        } files must be ≤${MAX_SIZE_MB}MB.`,
      );
      return;
    }

    setUploadedFile(file);
    if (!qrName) {
      setQrName(file.name);
    }
  };

  

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const handleQrNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrName(value);
  };

  const canGenerate =
    qrName.trim() &&
    (type === "url"
      ? urlValue.trim()
      : type === "text"
        ? textValue.trim()
        : uploadedFile) &&
    (!passwordProtect || password.trim()) &&
    (!selfDestruct ||
      (destructViews && viewsValue.trim()) ||
      (destructTime && timeValue.trim()));

  const canGenerate = hasContent && hasValidName && hasValidSecurity;

  // Calculate current step dynamically
  const currentStep = !hasContent ? 1 : !hasValidName ? 2 : canGenerate ? 3 : 2;

  // Track step completion for animations
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepJustCompleted, setStepJustCompleted] = useState<number | null>(null);

  // Update completed steps when progress is made
  useEffect(() => {
    const newCompletedSteps: number[] = [];
    if (hasContent) newCompletedSteps.push(1);
    if (hasValidName) newCompletedSteps.push(2);
    if (canGenerate) newCompletedSteps.push(3);

    // Check for newly completed step
    const justCompleted = newCompletedSteps.find(
      (step) => !completedSteps.includes(step)
    );

    if (justCompleted) {
      setStepJustCompleted(justCompleted);
      toast.success(
        justCompleted === 1
          ? "✓ Content added!"
          : justCompleted === 2
            ? "✓ Name provided!"
            : "✓ Ready to generate!",
        { duration: 2000 }
      );
      setTimeout(() => setStepJustCompleted(null), 2000);
    }

    setCompletedSteps(newCompletedSteps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent, hasValidName, canGenerate]);


  // check for last zap in local storage
  // Restore last zap safely (without restoring password)
  useEffect(() => {
    const lastZapStr = localStorage.getItem("lastZap");

    if (lastZapStr) {
      try {
        const lastQR = JSON.parse(lastZapStr);

        setQrName(lastQR.name || "");

        // 🚫 Never restore password for security reasons
        setPasswordProtect(false);
        setPassword("");

        setSelfDestruct(!!lastQR.selfDestruct);
        setDestructViews(!!lastQR.viewLimit);
        setDestructTime(!!lastQR.expiresAt);
        setViewsValue(lastQR.viewLimit ? String(lastQR.viewLimit) : "");
        setTimeValue(lastQR.expiresAt ? String(lastQR.expiresAt) : "");
        setUrlValue(lastQR.originalUrl || "");
        setTextValue(lastQR.textContent || "");
        setType(lastQR.type ? lastQR.type.toLowerCase() : "pdf");
      } catch (error) {
        console.warn("Failed to parse lastZap from localStorage:", error);
        localStorage.removeItem("lastZap");
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className={`bg-card rounded-3xl shadow-lg p-6 sm:p-10 space-y-8 sm:space-y-12 border border-border transition-all duration-500 ease-out animate-fade-in`}>
          {/* Enhanced Step Indicator with Visual Feedback */}
          <div className="space-y-6">
            {/* Current Step Badge with Animation */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                style={{
                  animation: stepJustCompleted
                    ? "pulse 0.5s ease-in-out"
                    : "none",
                }}
              >
                Step {currentStep} of 3
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                {currentStep === 3 ? "Ready!" : "Customize"}
                <Zap
                  className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${currentStep === 3 ? "text-primary animate-pulse" : ""
                    }`}
                />
              </span>
            </div>

            {/* Visual Step Indicators */}
            <div className="flex items-center gap-2 sm:gap-4">
              {[1, 2, 3].map((step) => {
                const isCompleted = completedSteps.includes(step);
                const isActive = currentStep === step;
                const stepLabels = [
                  "Add Content",
                  "Configure",
                  "Generate",
                ];

                return (
                  <div key={step} className="flex-1 flex items-center gap-2">
                    <div className="flex-1 flex flex-col gap-2">
                      {/* Step Circle */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 transform ${isCompleted
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                            : isActive
                              ? "bg-primary/30 text-primary scale-105 ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "bg-muted text-muted-foreground"
                            } ${stepJustCompleted === step
                              ? "animate-bounce"
                              : ""
                            }`}
                          style={{
                            animation:
                              stepJustCompleted === step
                                ? "bounce 0.5s ease-in-out"
                                : "none",
                          }}
                        >
                          {isCompleted ? (
                            <span className="text-lg">✓</span>
                          ) : (
                            step
                          )}
                        </div>
                        {/* Step Label - Hidden on mobile for space */}
                        <span
                          className={`hidden sm:block text-xs font-medium transition-all duration-300 ${isCompleted || isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                            }`}
                        >
                          {stepLabels[step - 1]}
                        </span>
                      </div>
                      {/* Progress Bar */}
                      {step < 3 && (
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${isCompleted
                              ? "bg-gradient-to-r from-primary via-primary/90 to-primary shadow-sm"
                              : "bg-transparent"
                              }`}
                            style={{
                              width: isCompleted ? "100%" : "0%",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Step Labels */}
            <div className="flex sm:hidden items-center justify-between px-2 text-xs text-muted-foreground">
              <span
                className={currentStep >= 1 ? "text-foreground font-medium" : ""}
              >
                Content
              </span>
              <span
                className={currentStep >= 2 ? "text-foreground font-medium" : ""}
              >
                Configure
              </span>
              <span
                className={currentStep >= 3 ? "text-foreground font-medium" : ""}
              >
                Generate
              </span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              Customize
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
          </div>

          {/* QR Code Name */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${completedSteps.includes(2) ? "bg-primary shadow-lg" : "bg-primary/50"
                  }`}
              ></div>
              Name your QR Code
            </Label>
            <Input
              id="qr-name"
              placeholder="Enter a memorable name..."
              value={qrName}
              onChange={handleQrNameChange}
              className="input-focus rounded-xl border-border bg-background h-14 px-6 font-medium text-lg focus-ring"
            />
          </div>

          {/* Content Input */}
          {type === "url" ? (
            <div
              className="space-y-4 transition-all duration-500 transform"
              style={{
                opacity: currentStep >= 1 ? 1 : 0.8,
                transform: currentStep >= 1 ? "translateY(0)" : "translateY(-10px)",
              }}
            >
              <Label
                htmlFor="url"
                className="text-lg font-semibold text-foreground flex items-center gap-3"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <Link className="h-5 w-5 text-blue-500" />
                Enter URL
              </Label>
              <Input
                id="url"
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com"
                className="input-focus rounded-xl border-border bg-background h-14 px-6 text-lg focus-ring"
              />
              <p className="text-sm text-muted-foreground pl-6">
                {TYPE_MESSAGES[type]}
              </p>
            </div>
          ) : type === "text" ? (
            <div
              className="space-y-4 transition-all duration-500 transform"
              style={{
                opacity: currentStep >= 1 ? 1 : 0.8,
                transform: currentStep >= 1 ? "translateY(0)" : "translateY(-10px)",
              }}
            >
              <Label
                htmlFor="text"
                className="text-lg font-semibold text-foreground flex items-center gap-3"
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <TypeIcon className="h-5 w-5 text-yellow-500" />
                Enter Text
              </Label>
              <textarea
                id="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter your text content here..."
                className="w-full min-h-[140px] p-6 text-base rounded-xl border border-border bg-background text-foreground resize-vertical transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus-ring"
                rows={6}
                maxLength={10000}
              />
              <div className="flex justify-between items-center px-2">
                <p className="text-sm text-muted-foreground">
                  {TYPE_MESSAGES[type]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {textValue.length}/10,000 characters
                </p>
              </div>
            </div>
          ) : (
            <div
              className="space-y-6 transition-all duration-500 transform"
              style={{
                opacity: currentStep >= 1 ? 1 : 0.8,
                transform: currentStep >= 1 ? "translateY(0)" : "translateY(-10px)",
              }}
            >
              <div className="space-y-4">
                <Label
                  className="text-lg font-semibold text-foreground flex items-center gap-3"
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <FileText className="h-5 w-5 text-purple-500" />
                  Upload File
                </Label>

                <FileUpload
                  key={type}
                  maxFiles={1}
                  maxSizeInMB={MAX_SIZE_MB}
                  acceptedFileTypes={TYPE_EXTENSIONS[type]}
                  onUpload={handleFilesFromUploader}
                  onError={handleUploadError}
                  multiple={false}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground pl-6">
                  {TYPE_MESSAGES[type]}
                </p>
              </div>

              {type === "pdf" && (
                <div className="flex items-center gap-3 pl-6">
                  <Switch
                    id="compress-pdf"
                    checked={compressPdf}
                    onCheckedChange={setCompressPdf}
                  />
                  <label htmlFor="compress-pdf" className="text-sm text-muted-foreground">
                    Compress PDF before upload
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Security Options with Animation */}
          <div
            className="space-y-8 transition-all duration-500 transform"
            style={{
              opacity: currentStep >= 2 ? 1 : 0.5,
              transform: currentStep >= 2 ? "translateY(0)" : "translateY(10px)",
              pointerEvents: currentStep >= 2 ? "auto" : "none",
            }}
          >
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Security Options
            </h3>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all duration-200">
                <Checkbox
                  id="password-protect"
                  checked={passwordProtect}
                  onCheckedChange={handlePasswordProtectChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5"
                />
                <Label
                  htmlFor="password-protect"
                  className="text-base font-medium text-foreground cursor-pointer flex items-center gap-3"
                >
                  <Shield className="h-5 w-5 text-primary" />
                  Password Protection
                </Label>
              </div>

              {passwordProtect && (
                <div className="pl-10">
                  <Input
                    type="password"
                    placeholder="Enter a secure password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-focus rounded-xl border-border bg-background h-12 focus-ring"
                  />
                </div>
              )}

              <div className="flex items-center space-x-4 p-6 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all duration-200">
                <Checkbox
                  id="self-destruct"
                  checked={selfDestruct}
                  onCheckedChange={handleSelfDestructChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5"
                />
                <Label
                  htmlFor="self-destruct"
                  className="text-base font-medium text-foreground cursor-pointer flex items-center gap-3"
                >
                  <Clock className="h-5 w-5 text-orange-500" />
                  Self Destruct
                </Label>
              </div>

              {selfDestruct && (
                <div className="pl-10 space-y-6">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                    <Checkbox
                      id="destruct-views"
                      checked={destructViews}
                      onCheckedChange={(checked) =>
                        setDestructViews(checked === true)
                      }
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-5 h-5"
                    />
                    <Label
                      htmlFor="destruct-views"
                      className="text-base font-medium text-foreground cursor-pointer flex items-center gap-3"
                    >
                      <Eye className="h-5 w-5 text-orange-500" />
                      After Views
                    </Label>
                  </div>

                  {destructViews && (
                    <div className="pl-8">
                      <Input
                        type="number"
                        placeholder="Number of views"
                        value={viewsValue}
                        onChange={handleViewsValueChange}
                        className="input-focus rounded-xl border-border bg-background h-12 focus-ring"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                    <Checkbox
                      id="destruct-time"
                      checked={destructTime}
                      onCheckedChange={(checked) =>
                        setDestructTime(checked === true)
                      }
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-5 h-5"
                    />
                    <Label
                      htmlFor="destruct-time"
                      className="text-base font-medium text-foreground cursor-pointer flex items-center gap-3"
                    >
                      <Clock className="h-5 w-5 text-orange-500" />
                      After Time
                    </Label>
                  </div>

                  {destructTime && (
                    <div className="pl-8">
                      <Input
                        type="number"
                        placeholder="Hours until expiration"
                        value={timeValue}
                        onChange={handleTimeValueChange}
                        className="input-focus rounded-xl border-border bg-background h-12 focus-ring"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-8">
            <Button
              onClick={handleGenerateAndContinue}
              disabled={!canGenerate || loading}
              className={`w-full h-16 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-ring ${canGenerate && !loading
                ? "animate-pulse-subtle ring-2 ring-primary/30"
                : ""
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Generating QR Code...
                </>
              ) : (
                <>
                  <Zap className="mr-3 h-6 w-6" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>

          {/* Continue to QR Button */}
          {lastQR &&
            lastQRFormHash ===
            getFormDataHash({
              qrName,
              uploadedFile,
              passwordProtect,
              selfDestruct,
              destructViews,
              destructTime,
              viewsValue,
              timeValue,
              urlValue,
              textValue,
              type,
            }) && (
              <div className="w-full flex justify-center">
                <Button
                  className="w-full max-w-md h-14 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] focus-ring"
                  onClick={() => navigate("/customize", { state: lastQR })}
                >
                  Continue to QR Customization
                </Button>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}