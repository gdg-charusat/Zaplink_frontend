import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, Loader2, X, Shield, Clock, Eye, Zap, FileText, Link, Type as TypeIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Switch } from "./ui/switch";

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
  const [destructViews, setDestructViews] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("destructViews") || "false");
    } catch (error) {
      console.warn("Failed to parse destructViews from sessionStorage:", error);
      return false;
    }
  });
  const [destructTime, setDestructTime] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("destructTime") || "false");
    } catch (error) {
      console.warn("Failed to parse destructTime from sessionStorage:", error);
      return false;
    }
  });
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
  const [lastQR, setLastQR] = useState(() => {
    try {
      const data = sessionStorage.getItem("lastQR");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("Failed to parse lastQR from sessionStorage:", error);
      sessionStorage.removeItem("lastQR");
      return null;
    }
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
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const validateFileType = (file: File) => {
    if (
      type === "url" ||
      type === "text" ||
      type === "document" ||
      type === "presentation"
    )
      return true;
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const allowed = TYPE_EXTENSIONS[type] || [];
    return allowed.length === 0 || allowed.includes(ext);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } files must be ≤${MAX_SIZE_MB}MB.`
      );
      e.target.value = "";
      return;
    }
    if (type === "pdf" && compressPdf) {
      // Placeholder: compress PDF client-side
      // const compressed = await compressPDF(file, 10 * 1024 * 1024);
      // setUploadedFile(compressed);
      toast.info(
        "PDF compression is not yet implemented. Uploading original file."
      );
      setUploadedFile(file);
      return;
    }
    if (type === "text") {
      toast.error(
        "Text type does not require file upload. Please use the text input below."
      );
      e.target.value = "";
      return;
    }
    if (type === "document" || type === "presentation") {
      // Allow these types to proceed with file upload
    } else if (!validateFileType(file)) {
      toast.error(TYPE_MESSAGES[type] || "Invalid file type.");
      e.target.value = "";
      return;
    }
    setUploadedFile(file);
    setQrName(qrName ? qrName : file.name);
    toast.success(`File "${file.name}" selected successfully!`);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    toast.info("File removed");
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

  // Add this useEffect after state declarations
  useEffect(() => {
    if (lastQR && lastQRFormHash) {
      // Only prefill if form is at initial state (e.g., no file, no name, etc)
      const isInitial =
        !qrName &&
        !uploadedFile &&
        !passwordProtect &&
        !password &&
        !selfDestruct &&
        !destructViews &&
        !destructTime &&
        !viewsValue &&
        !timeValue &&
        !urlValue &&
        !textValue;
      if (isInitial) {
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
        setType(lastQR.type ? lastQR.type.toLowerCase() : type);
        // Note: File cannot be restored for security reasons, user must reselect if needed
      }
    }
  }, []);

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
            <Input
              id="qr-name"
              placeholder="Enter a memorable name..."
              value={qrName}
              onChange={handleQrNameChange}
              className="input-focus text-base rounded-xl border-border bg-background h-14 px-6 font-medium text-lg focus-ring"
            />
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
              <Input
                id="url"
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com"
                className="input-focus text-base rounded-xl border-border bg-background h-14 px-6 text-lg focus-ring"
              />
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
            <div className="space-y-6">
              <div className="space-y-4">
                <Label
                  htmlFor="file"
                  className="text-lg font-semibold text-foreground flex items-center gap-3"
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <FileText className="h-5 w-5 text-purple-500" />
                  Upload File
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept={TYPE_EXTENSIONS[type].join(",")}
                    className="cursor-pointer h-14 rounded-xl border-border bg-background file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all duration-200 focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground pl-6">
                  {TYPE_MESSAGES[type]}
                </p>
                <p className="text-xs text-muted-foreground pl-6">
                  Max size: {type === "video" ? "100MB" : "10MB"}
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

              {uploadedFile && (
                <div className="p-6 border border-border rounded-xl bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-lg">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-3 hover:bg-destructive/10 rounded-xl transition-colors duration-200 group focus-ring"
                      title="Remove file"
                    >
                      <X className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
                    </button>
                  </div>
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