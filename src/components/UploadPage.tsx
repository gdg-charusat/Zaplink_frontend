import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileIcon,
  X,
  Loader2,
  Image as ImageIcon,
  FileArchive,
  FileText,
  FileAudio,
  FileVideo,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useTheme } from "../lib/theme-provider";

const ALLOWED_FILE_TYPES = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
  pdf: [".pdf"],
  document: [".doc", ".docx", ".txt", ".rtf"],
  spreadsheet: [".xls", ".xlsx", ".csv"],
  presentation: [".ppt", ".pptx"],
  archive: [".zip", ".rar", ".7z", ".tar", ".gz"],
  audio: [".mp3", ".wav", ".ogg", ".m4a"],
  video: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
  url: [], // URLs don't have file extensions
};

const TYPE_MESSAGES = {
  image: "Supports: .jpg, .jpeg, .png, .webp",
  pdf: "Supports: .pdf only",
  zip: "Supports: .zip, .rar",
  url: "Enter a valid http:// or https:// link",
  docx: "Supports: .doc, .docx",
  pptx: "Supports: .ppt, .pptx",
  text: "Supports: .txt",
  audio: "Supports: .mp3, .wav, .ogg, .m4a",
  video: "Supports: .mp4, .avi, .mov, .wmv, .flv",
};
const TYPE_EXTENSIONS = {
  image: [".jpg", ".jpeg", ".png", ".webp"],
  pdf: [".pdf"],
  zip: [".zip", ".rar"],
  docx: [".doc", ".docx"],
  pptx: [".ppt", ".pptx"],
  text: [".txt"],
  audio: [".mp3", ".wav", ".ogg", ".m4a"],
  video: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
};

function getFileIcon(type, ext) {
  if (type.startsWith("image"))
    return <ImageIcon className="h-6 w-6 text-blue-400" />;
  if (type.startsWith("audio"))
    return <FileAudio className="h-6 w-6 text-green-400" />;
  if (type.startsWith("video"))
    return <FileVideo className="h-6 w-6 text-purple-400" />;
  if (type === "application/pdf")
    return <FileText className="h-6 w-6 text-red-400" />;
  if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(ext))
    return <FileArchive className="h-6 w-6 text-yellow-400" />;
  return <FileIcon className="h-6 w-6 text-muted-foreground" />;
}

function formatFileSize(size) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadPage() {
  const location = useLocation();
  const initialType = location.state?.type || "pdf";
  const { theme } = useTheme();

  const navigate = useNavigate();
  const [qrName, setQrName] = useState(
    () => sessionStorage.getItem("qrName") || ""
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
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
  const [type, setType] = useState(initialType);
  const [urlValue, setUrlValue] = useState("");

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
    sessionStorage.setItem("contentType", type);
  }, [type]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const getAcceptAttribute = () => {
    switch (type) {
      case "pdf":
        return ".pdf";
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "audio":
        return "audio/*";
      case "text":
        return ".txt";
      case "docx":
        return ".docx";
      case "pptx":
        return ".pptx";
      default:
        return "*";
    }
  };

  const getSupportsText = () => {
    switch (type) {
      case "pdf":
        return "PDF files only";
      case "image":
        return "Image files only";
      case "video":
        return "Video files only";
      case "audio":
        return "Audio files only";
      case "text":
        return "Text files only";
      case "docx":
        return "DOCX files only";
      case "pptx":
        return "PPTX files only";
      default:
        return "Various file types";
    }
  };

  const canGenerate =
    qrName.trim() &&
    uploadedFile &&
    (!passwordProtect || password.trim()) &&
    (!selfDestruct ||
      (destructViews && viewsValue.trim()) ||
      (destructTime && timeValue.trim()));

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
      formData.append("url", urlValue);
      formData.append("name", qrName);
      formData.append("type", "URL");
      if (selfDestruct && destructViews && viewsValue.trim()) {
        formData.append("viewLimit", viewsValue);
      }
      // ...rest of your submit logic for URL...
      return;
    }
    if (!uploadedFile && type !== "url") {
      toast.error("Missing required fields");
      return;
    }
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("name", qrName);
    formData.append("type", type.toUpperCase());
    if (passwordProtect && password.trim())
      formData.append("password", password);
    if (selfDestruct && destructViews && viewsValue.trim()) {
      formData.append("viewLimit", viewsValue);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/zaps/upload",
        formData
      );
      const { data } = response.data;

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

  const handlePasswordProtectChange = (checked: boolean) => {
    setPasswordProtect(checked);
    if (checked) {
      setSelfDestruct(false);
      setDestructViews(false);
      setDestructTime(false);
      setViewsValue("");
      setTimeValue("");
    }
  };

  const handleSelfDestructChange = (checked: boolean) => {
    setSelfDestruct(checked);
    if (checked) {
      setPasswordProtect(false);
      setPassword("");
    } else {
      setDestructViews(false);
      setDestructTime(false);
      setViewsValue("");
      setTimeValue("");
    }
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

  const validateFileType = (file: File) => {
    if (type === "url") return true;
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const allowed = TYPE_EXTENSIONS[type] || [];
    return allowed.length === 0 || allowed.includes(ext);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFileType(file)) {
      toast.error(TYPE_MESSAGES[type] || "Invalid file type.");
      e.target.value = "";
      return;
    }
    setUploadedFile(file);
    setQrName(qrName ? qrName : file.name);
  };

  const handleQrNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrName(value);
    if (type === "url" && value && !/^https?:\/\//.test(value)) {
      toast.error("Please enter a valid http:// or https:// link");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Upload Your Content
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-xl">
        <div className="bg-card rounded-xl shadow-lg p-8 space-y-8 border border-border">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">
              Step 2 of 3
            </span>
            <div className="flex-1 mx-4 h-0.5 bg-border">
              <div className="h-0.5 bg-blue-600 w-2/3" />
            </div>
            <span className="text-sm text-muted-foreground">Customize →</span>
          </div>

          {/* QR Code Name */}
          {type === "url" ? (
            <div className="space-y-2">
              <Label className="text-base font-medium text-foreground">
                Name your QR Code
              </Label>
              <Input
                id="qr-name"
                placeholder="Enter a name for your QR code"
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
              />
              <Label className="text-base font-medium text-foreground mt-4">
                Paste your URL
              </Label>
              <Input
                type="text"
                placeholder="Enter a valid http:// or https:// link"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
              />
            </div>
          ) : (
            <>
              <Label className="text-base font-medium text-foreground">
                Name your QR Code
              </Label>
              <Input
                id="qr-name"
                placeholder="Enter a name for your QR code"
                value={qrName}
                onChange={handleQrNameChange}
                className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
              />
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                  isDragOver
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-foreground/50"
                )}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept={TYPE_EXTENSIONS[type]?.join(",") || "*"}
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground mb-1">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  {TYPE_MESSAGES[type] || "Supports: various file types"}
                </p>
              </div>
            </>
          )}

          {/* Password Protect */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="password-protect"
              checked={passwordProtect}
              onCheckedChange={setPasswordProtect}
              className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
            />
            <Label
              htmlFor="password-protect"
              className="text-base font-medium text-foreground"
            >
              Password Protect
            </Label>
          </div>

          {passwordProtect && (
            <Input
              type="password"
              id="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
            />
          )}

          {/* Self Destruct */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="self-destruct"
              checked={selfDestruct}
              onCheckedChange={setSelfDestruct}
              className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
            />
            <Label
              htmlFor="self-destruct"
              className="text-base font-medium text-foreground"
            >
              Self Destruct
            </Label>
          </div>

          {selfDestruct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destruct-views"
                    checked={destructViews}
                    onCheckedChange={(checked) =>
                      setDestructViews(checked as boolean)
                    }
                    className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                  />
                  <Label
                    htmlFor="destruct-views"
                    className="text-base font-medium text-foreground"
                  >
                    After number of views
                  </Label>
                </div>
                {destructViews && (
                  <Input
                    type="text"
                    id="views-value"
                    value={viewsValue}
                    onChange={handleViewsValueChange}
                    className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destruct-time"
                    checked={destructTime}
                    onCheckedChange={(checked) =>
                      setDestructTime(checked as boolean)
                    }
                    className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                  />
                  <Label
                    htmlFor="destruct-time"
                    className="text-base font-medium text-foreground"
                  >
                    After number of hours
                  </Label>
                </div>
                {destructTime && (
                  <Input
                    type="text"
                    id="time-value"
                    value={timeValue}
                    onChange={handleTimeValueChange}
                    className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
                  />
                )}
              </div>
            </div>
          )}

          {/* Uploaded File */}
          {uploadedFile && (
            <div className="border border-border rounded-lg p-4 flex items-center gap-4 bg-card">
              {getFileIcon(
                uploadedFile.type,
                uploadedFile.name.slice(uploadedFile.name.lastIndexOf("."))
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Uploaded: {uploadedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Generate and Continue Button */}
          <Button
            onClick={handleGenerateAndContinue}
            disabled={!canGenerate || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Generate QR & Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
