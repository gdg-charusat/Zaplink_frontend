import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Shield, Clock, Eye, Zap, FileText, Link, Type as TypeIcon, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import FileUpload from "./FileUpload";

// Only trim input. Do NOT modify user content.
// Validation should be handled separately.
// Only sanitize for fields where HTML tags are unsafe (e.g., QR name)

const sanitizeQrName = (value: string) => {
  return value.trim();
};

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

type FormErrors = {
  password: string;
  views: string;
  expiry: string;
};

// Add a type for the form data hash function
interface FormDataHash {
  qrName: string;
  uploadedFile: File | null;
  passwordProtect: boolean;
  password: string;
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
  password,
  selfDestruct,
  destructViews,
  destructTime,
  viewsValue,
  timeValue,
  urlValue,
  textValue,
  type,
}: FormDataHash) {
  return JSON.stringify({
    qrName,
    fileName: uploadedFile?.name || null,
    passwordProtect,
    password,
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

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const isValidPassword = (password: string): boolean => passwordRegex.test(password);
const isPositiveNumber = (value: number): boolean => Number.isInteger(value) && value > 0;

export default function UploadPage() {
  const location = useLocation();
  const initialType = (location.state?.type as FileType) || "pdf";
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({
    password: "",
    views: "",
    expiry: "",
  });
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
  const [enableAccessQuiz, setEnableAccessQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [enableDelayedAccess, setEnableDelayedAccess] = useState(false);
  const [delayedAccessValue, setDelayedAccessValue] = useState("");
  const [delayedAccessType, setDelayedAccessType] = useState<
    "minutes" | "hours" | "days"
  >("hours");
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
  const handleGenerateAndContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: FormErrors = {
      password: "",
      views: "",
      expiry: "",
    };

    if (passwordProtect && password && !isValidPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }

    if (
      selfDestruct &&
      destructViews &&
      !isPositiveNumber(Number(viewsValue))
    ) {
      newErrors.views = "Value must be greater than 0";
    }
    if (
      selfDestruct &&
      destructTime &&
      !isPositiveNumber(Number(timeValue))
    ) {
      newErrors.expiry = "Value must be greater than 0";
    }

    setErrors(newErrors);

    if (newErrors.password || newErrors.views || newErrors.expiry) {
      // Stop submission if there are validation errors
      return;
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
      formData.append("name", qrName.trim());
      formData.append("type", "URL");
      if (passwordProtect && password.trim()) {
        formData.append("password", password.trim());
      }
      if (selfDestruct && destructViews && viewsValue.trim()) {
        formData.append("viewLimit", viewsValue.trim());
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
          password,
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

        navigate("/customize", {
          state: {
            zapId: data.zapId,
            shortUrl: data.shortUrl,
            qrCode: data.qrCode,
            type: data.type.toUpperCase(),
            name: data.name,
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
          password,
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

        navigate("/customize", {
          state: {
            zapId: data.zapId,
            shortUrl: data.shortUrl,
            qrCode: data.qrCode,
            type: data.type.toUpperCase(),
            name: data.name,
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
        password,
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

      navigate("/customize", {
        state: {
          zapId: data.zapId,
          shortUrl: data.shortUrl,
          qrCode: data.qrCode,
          type: data.type.toUpperCase(),
          name: data.name,
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
  };

  // On form input change, clear lastQR if form hash changes
  useEffect(() => {
    const formHash = getFormDataHash({
      qrName,
      uploadedFile,
      passwordProtect,
      password,
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
    password,
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
  const handleSelfDestructChange = (checked: boolean | "indeterminate") => {
    setSelfDestruct(checked === true);
  };

  const handleViewsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setViewsValue(value);
    const num = Number(value);
    if (!isPositiveNumber(num)) {
      setErrors((prev) => ({
        ...prev,
        views: "Value must be greater than 0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, views: "" }));
    }
  };

  const handleTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setTimeValue(value);
    const num = Number(value);
    if (!isPositiveNumber(num)) {
      setErrors((prev) => ({
        ...prev,
        expiry: "Value must be greater than 0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, expiry: "" }));
    }
  };

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setPassword(value);

  let error = "";

  if (value && !isValidPassword(value)) {
    error =
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
  }

  setErrors(prev => ({
    ...prev,
    password: error
  }));
};

const handlePasswordProtectChange = (checked: boolean | "indeterminate") => {
  setPasswordProtect(checked === true);
  if (!checked) {
    setPassword("");
    setErrors(prev => ({ ...prev, password: "" }));
  }
};

// Removed duplicate isStrongPassword, use isValidPassword everywhere

// Add file size constraints
  const MAX_SIZE_MB = type === "video" ? 100 : 10;

  // Handle files from the FileUpload component
  const handleFilesFromUploader = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]; // Use first file for backward compat
      setUploadedFile(file);
      if (!qrName) {
        setQrName(file.name);
      }
    } else {
      setUploadedFile(null);
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const handleQrNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrName(sanitizeQrName(value));
  };

  // Step calculation logic
  const hasContent =
    (type === "url" && urlValue.trim()) ||
    (type === "text" && textValue.trim()) ||
    (type !== "url" && type !== "text" && uploadedFile);

  const hasValidName = qrName.trim().length > 0;

  const hasValidSecurity =
    (!passwordProtect || (password.trim() && isValidPassword(password))) &&
    (!selfDestruct ||
      (destructViews && viewsValue.trim()) ||
      (destructTime && timeValue.trim()));

  const canGenerate = Boolean(hasContent && hasValidName && hasValidSecurity);

  // Add this useEffect after state declarations
  useEffect(() => {
    // check for last zap in local storage
    const lastZapStr = localStorage.getItem("lastZap");
    if (lastZapStr) {
      const lastQR = JSON.parse(lastZapStr);
      // Only restore if current state is empty
      // We check the refs or assume it's mount time
      setQrName(lastQR.name || "");
      setPasswordProtect(!!lastQR.password);
      setPassword(lastQR.password || "");
      setSelfDestruct(!!lastQR.selfDestruct);
      setDestructViews(!!lastQR.viewLimit);
      setDestructTime(!!lastQR.expiresAt);
      setViewsValue(lastQR.viewLimit ? String(lastQR.viewLimit) : "");
      setTimeValue(lastQR.expiresAt ? String(lastQR.expiresAt) : "");
      setUrlValue(lastQR.originalUrl || "");
      setTextValue(lastQR.textContent || "");
      setType(lastQR.type ? lastQR.type.toLowerCase() : "file");
      // Note: File cannot be restored for security reasons
    }
  }, []); // Run only once on mount to restore previous session state

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="bg-card rounded-3xl shadow-lg p-6 sm:p-10 space-y-8 sm:space-y-12 border border-border">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full">
              Step 2 of 3
            </span>
            <div className="flex-1 mx-4 sm:mx-6 h-2 bg-muted rounded-full overflow-hidden">
              <div className="progress-bar h-full w-2/3"></div>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              Customize
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
          </div>

          {/* QR Code Name */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              Name your QR Code
            </Label>
            <div className="relative">
              <Input
                id="qr-name"
                placeholder="Enter a memorable name..."
                value={qrName}
                onChange={handleQrNameChange}
                className="input-focus rounded-xl border-border bg-background h-14 px-6 pr-12 font-medium text-lg focus-ring"
              />
              {qrName && (
                <button
                  onClick={() => setQrName("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground focus-ring"
                  aria-label="Clear name"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content Input */}
          {type === "url" ? (
            <div className="space-y-4">
              <Label
                htmlFor="url"
                className="text-lg font-semibold text-foreground flex items-center gap-3"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <Link className="h-5 w-5 text-blue-500" />
                Enter URL
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com"
                  className="input-focus rounded-xl border-border bg-background h-14 px-6 pr-12 text-lg focus-ring"
                />
                {urlValue && (
                  <button
                    onClick={() => setUrlValue("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground focus-ring"
                    aria-label="Clear URL"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {TYPE_MESSAGES[type]}
              </p>
            </div>
          ) : type === "text" ? (
            <div className="space-y-4">
              <Label
                htmlFor="text"
                className="text-lg font-semibold text-foreground flex items-center gap-3"
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <TypeIcon className="h-5 w-5 text-yellow-500" />
                Enter Text
              </Label>
              <div className="relative">
                <textarea
                  id="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Enter your text content here..."
                  className="w-full min-h-[140px] p-6 pr-12 text-base rounded-xl border border-border bg-background text-foreground resize-vertical transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus-ring"
                  rows={6}
                  maxLength={10000}
                />
                {textValue && (
                  <button
                    onClick={() => setTextValue("")}
                    className="absolute right-4 top-6 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground focus-ring"
                    aria-label="Clear text"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
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
            <div className="space-y-6">
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

          {/* Security Options */}
          <div className="space-y-8">
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
  onChange={handlePasswordChange}
  className={`input-focus rounded-xl border-border bg-background h-12 focus-ring ${errors.password ? 'border-destructive' : ''}`}
/>
{errors.password && (
  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
)}
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
                        min={1}
                        placeholder="Number of views"
                        value={viewsValue}
                        onChange={handleViewsValueChange}
                        className={`input-focus rounded-xl border-border bg-background h-12 focus-ring ${
                          errors.views ? "border-destructive" : ""
                        }`}
                      />
                      {errors.views && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.views}
                        </p>
                      )}
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
                        min={1}
                        placeholder="Hours until expiration"
                        value={timeValue}
                        onChange={handleTimeValueChange}
                        className={`input-focus rounded-xl border-border bg-background h-12 focus-ring ${
                          errors.expiry ? "border-destructive" : ""
                        }`}
                      />
                      {errors.expiry && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.expiry}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Access Quiz */}
          <div className="space-y-8 border-t border-border pt-8">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-500" />
              Access Quiz (Optional)
            </h3>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 rounded-xl bg-muted/30 border border-border hover:border-blue-500/30 transition-all duration-200">
                <Checkbox
                  id="enable-quiz"
                  checked={enableAccessQuiz}
                  onCheckedChange={(checked) =>
                    setEnableAccessQuiz(checked === true)
                  }
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 w-5 h-5"
                />
                <Label
                  htmlFor="enable-quiz"
                  className="text-base font-medium text-foreground cursor-pointer flex items-center gap-3"
                >
                  <Shield className="h-5 w-5 text-blue-500" />
                  Protect with Quiz
                </Label>
              </div>

              {enableAccessQuiz && (
                <div className="pl-10 space-y-4">
                  <div>
                    <Label
                      htmlFor="quiz-question"
                      className="text-base font-medium text-foreground block mb-2"
                    >
                      Quiz Question
                    </Label>
                    <Input
                      id="quiz-question"
                      placeholder="e.g., What is the capital of France?"
                      value={quizQuestion.trim()}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      className="input-focus rounded-xl border-border bg-background h-12 focus-ring"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="quiz-answer"
                      className="text-base font-medium text-foreground block mb-2"
                    >
                      Answer (Case-Insensitive)
                    </Label>
                    <Input
                      id="quiz-answer"
                      type="password"
                      placeholder="e.g., Paris"
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      className="input-focus rounded-xl border-border bg-background h-12 focus-ring"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Users must answer correctly to access the file. Answers are
                    case-insensitive.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delayed File Access */}
          <div className="space-y-8 border-t border-border pt-8">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Clock className="h-6 w-6 text-green-500" />
              Delayed File Access (Optional)
            </h3>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 rounded-xl bg-muted/30 border border-border hover:border-green-500/30 transition-all duration-200">
                <Checkbox
                  id="enable-delayed-access"
                  checked={enableDelayedAccess}
                  onCheckedChange={(checked) =>
                    setEnableDelayedAccess(checked === true)
                  }
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 w-5 h-5"
                />
                <Label
                  htmlFor="enable-delayed-access"
                  className="text-base font-medium text-foreground cursor-pointer flex items-center gap-3"
                >
                  <Clock className="h-5 w-5 text-green-500" />
                  Schedule Access
                </Label>
              </div>

              {enableDelayedAccess && (
                <div className="pl-10 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="delayed-value"
                        className="text-base font-medium text-foreground block mb-2"
                      >
                        Unlock After
                      </Label>
                      <Input
                        id="delayed-value"
                        type="number"
                        placeholder="e.g., 24"
                        value={delayedAccessValue}
                        onChange={(e) => setDelayedAccessValue(e.target.value)}
                        min="1"
                        className="input-focus rounded-xl border-border bg-background h-12 focus-ring"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="delayed-type"
                        className="text-base font-medium text-foreground block mb-2"
                      >
                        Time Unit
                      </Label>
                      <select
                        id="delayed-type"
                        value={delayedAccessType}
                        onChange={(e) =>
                          setDelayedAccessType(
                            e.target.value as "minutes" | "hours" | "days",
                          )
                        }
                        className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-base focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    File will be inaccessible until the specified time. QR code
                    remains valid but locked.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8">
            <Button
              onClick={handleGenerateAndContinue}
              disabled={!canGenerate || loading}
              className="w-full h-16 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-ring"
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
              password,
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
