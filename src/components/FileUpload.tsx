import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  File as FileIcon,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface FileUploadProps {
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in megabytes */
  maxSizeInMB?: number;
  /** Accepted file types (extensions like ".jpg" or MIME types like "image/*") */
  acceptedFileTypes?: string[];
  /** Callback when the list of valid files changes */
  onUpload: (files: File[]) => void;
  /** Callback when a validation error occurs */
  onError?: (error: string) => void;
  /** Allow multiple file uploads */
  multiple?: boolean;
}

interface UploadFileState {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  previewUrl?: string;
  previewType: "image" | "video" | "audio" | "pdf" | "text" | "none";
  error?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : "";
}

/**
 * Determine what kind of preview is possible for a given file.
 */
function detectPreviewType(
  file: File
): "image" | "video" | "audio" | "pdf" | "text" | "none" {
  const mime = file.type;
  const ext = getFileExtension(file.name);

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf" || ext === ".pdf") return "pdf";

  // Text-readable formats
  const textExtensions = [".txt", ".csv", ".rtf", ".md", ".json", ".xml", ".log"];
  if (mime.startsWith("text/") || textExtensions.includes(ext)) return "text";

  return "none";
}

function getFileIcon(file: File): React.ReactNode {
  const mime = file.type;
  const ext = getFileExtension(file.name);

  if (mime.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-purple-500" />;
  if (mime.startsWith("video/")) return <Film className="h-5 w-5 text-blue-500" />;
  if (mime.startsWith("audio/")) return <Music className="h-5 w-5 text-pink-500" />;
  if (mime === "application/pdf") return <FileText className="h-5 w-5 text-red-500" />;

  // Spreadsheets
  if ([".xls", ".xlsx", ".csv"].includes(ext) || mime.includes("spreadsheet"))
    return <FileSpreadsheet className="h-5 w-5 text-green-600" />;

  // Presentations
  if ([".ppt", ".pptx"].includes(ext) || mime.includes("presentation"))
    return <Presentation className="h-5 w-5 text-orange-500" />;

  // Documents
  if ([".doc", ".docx", ".rtf", ".txt"].includes(ext) || mime.includes("document") || mime.includes("word"))
    return <FileText className="h-5 w-5 text-blue-600" />;

  // Archives
  if (
    [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"].includes(ext) ||
    mime.includes("zip") ||
    mime.includes("rar") ||
    mime.includes("tar") ||
    mime.includes("gzip")
  )
    return <Archive className="h-5 w-5 text-yellow-600" />;

  return <FileIcon className="h-5 w-5 text-muted-foreground" />;
}

// ── Component ────────────────────────────────────────────────────────────────

const FileUpload: React.FC<FileUploadProps> = ({
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedFileTypes,
  onUpload,
  onError,
  multiple = true,
}) => {
  const [files, setFiles] = useState<UploadFileState[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const isInitialMount = useRef(true);

  // ── Notify parent when files change (skip initial mount) ─────────────────

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const validFiles = files
      .filter((f) => f.status !== "error")
      .map((f) => f.file);
    onUpload(validFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    const intervals = intervalsRef.current;
    const objectUrls = objectUrlsRef.current;
    return () => {
      // Clear all running intervals
      intervals.forEach((id) => clearInterval(id));
      intervals.clear();
      // Revoke all object URLs
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateFile = useCallback(
    (file: File): string | null => {
      // Empty file check
      if (file.size === 0) {
        return `"${file.name}" is empty (0 bytes)`;
      }

      // Size validation
      const maxBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxBytes) {
        return `"${file.name}" exceeds the ${maxSizeInMB}MB limit (${formatFileSize(file.size)})`;
      }

      // Type validation
      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
        const ext = getFileExtension(file.name);
        const extMatch = acceptedFileTypes.some(
          (t) => t.startsWith(".") && ext === t.toLowerCase()
        );
        const mimeMatch = acceptedFileTypes.some((t) => {
          if (t.startsWith(".")) return false; // already checked above
          if (t.endsWith("/*")) {
            // Wildcard MIME like "image/*"
            return file.type.startsWith(t.replace("/*", "/"));
          }
          return file.type === t;
        });

        if (!extMatch && !mimeMatch) {
          return `"${file.name}" is not an accepted file type. Allowed: ${acceptedFileTypes.join(", ")}`;
        }
      }

      return null;
    },
    [maxSizeInMB, acceptedFileTypes]
  );

  // ── Generate preview for a file ────────────────────────────────────────────

  const generatePreview = useCallback(
    (file: File, fileId: string, previewType: string) => {
      if (previewType === "image") {
        // Use FileReader for images (data URL for thumbnails)
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, previewUrl: result } : f
              )
            );
          }
        };
        reader.onerror = () => {
          // Silently fail — just won't show preview
          console.warn(`Failed to read preview for ${file.name}`);
        };
        reader.readAsDataURL(file);
      } else if (
        previewType === "video" ||
        previewType === "audio" ||
        previewType === "pdf"
      ) {
        // Use object URL for media/PDF previews (efficient, no memory copy)
        try {
          const objUrl = URL.createObjectURL(file);
          objectUrlsRef.current.add(objUrl);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, previewUrl: objUrl } : f
            )
          );
        } catch {
          console.warn(`Failed to create object URL for ${file.name}`);
        }
      } else if (previewType === "text") {
        // Read first 2000 chars of text files
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            // Store text content as a special data URI
            const truncated =
              result.length > 2000 ? result.slice(0, 2000) + "\n..." : result;
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, previewUrl: `text://${truncated}` }
                  : f
              )
            );
          }
        };
        reader.onerror = () => {
          console.warn(`Failed to read text preview for ${file.name}`);
        };
        // Only read the first 2KB for preview
        const slice = file.slice(0, 2048);
        reader.readAsText(slice);
      }
    },
    []
  );

  // ── Process files ──────────────────────────────────────────────────────────

  // ── Simulate progress (client-side visual feedback) ──────────────────────

  const simulateUploadProgress = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "uploading" as const, progress: 0 } : f
      )
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        intervalsRef.current.delete(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 100, status: "success" as const }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: Math.min(progress, 99) }
              : f
          )
        );
      }
    }, 200);

    intervalsRef.current.add(interval);
  }, []);

  // ── Process files ──────────────────────────────────────────────────────────

  const processFiles = useCallback(
    (incoming: FileList | File[]) => {
      const fileArray = Array.from(incoming);
      if (fileArray.length === 0) return;

      const maxAllowed = multiple ? maxFiles : 1;

      setFiles((prevFiles) => {
        const currentCount = prevFiles.filter(
          (f) => f.status !== "error"
        ).length;
        const slotsAvailable = maxAllowed - currentCount;

        if (slotsAvailable <= 0 && multiple) {
          onError?.(
            `Maximum of ${maxAllowed} file${maxAllowed > 1 ? "s" : ""} allowed`
          );
          return prevFiles;
        }

        const toProcess = multiple
          ? fileArray.slice(0, Math.max(slotsAvailable, 0))
          : fileArray.slice(0, 1);

        if (multiple && fileArray.length > slotsAvailable && slotsAvailable > 0) {
          onError?.(
            `Only ${slotsAvailable} more file${slotsAvailable > 1 ? "s" : ""} can be added (limit: ${maxAllowed})`
          );
        }

        const newStates: UploadFileState[] = [];

        for (const file of toProcess) {
          // Duplicate check
          const isDuplicate = prevFiles.some(
            (f) =>
              f.file.name === file.name &&
              f.file.size === file.size &&
              f.status !== "error"
          );
          if (isDuplicate) {
            onError?.(`"${file.name}" is already added`);
            continue;
          }

          const validationError = validateFile(file);
          const detectedType = detectPreviewType(file);
          const state: UploadFileState = {
            id: generateId(),
            file,
            progress: 0,
            status: validationError ? "error" : "pending",
            previewType: validationError ? "none" : detectedType,
            error: validationError || undefined,
          };

          // Schedule preview generation and progress simulation
          if (!validationError) {
            // Use setTimeout to ensure state is set before generating preview
            setTimeout(() => {
              generatePreview(file, state.id, detectedType);
              simulateUploadProgress(state.id);
            }, 0);
          }

          newStates.push(state);
        }

        if (newStates.length === 0) return prevFiles;

        // Single file mode: replace; Multi file: append
        return multiple ? [...prevFiles, ...newStates] : newStates;
      });
    },
    [maxFiles, multiple, onError, validateFile, generatePreview, simulateUploadProgress]
  );

  // ── Remove file ────────────────────────────────────────────────────────────

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileState = prev.find((f) => f.id === fileId);
      // Clean up object URL if it exists (skip data URLs and text:// URLs)
      if (
        fileState?.previewUrl &&
        fileState.previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(fileState.previewUrl);
        objectUrlsRef.current.delete(fileState.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  // ── Drag & Drop handlers ──────────────────────────────────────────────────

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      dragCounterRef.current = 0;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    [processFiles]
  );

  // ── Click & keyboard handlers ─────────────────────────────────────────────

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Reset so the same file can be selected again
        e.target.value = "";
      }
    },
    [processFiles]
  );

  // ── Build accept string ───────────────────────────────────────────────────

  const acceptString = acceptedFileTypes
    ? acceptedFileTypes.join(",")
    : undefined;

  // ── Preview renderer ──────────────────────────────────────────────────────

  const renderPreview = (fileState: UploadFileState) => {
    if (!fileState.previewUrl) return null;

    switch (fileState.previewType) {
      case "image":
        return (
          <div className="relative w-full bg-muted/30 flex items-center justify-center border-b border-border/50">
            <img
              src={fileState.previewUrl}
              alt={`Preview of ${fileState.file.name}`}
              className="max-h-60 max-w-full object-contain p-3"
              loading="lazy"
            />
          </div>
        );

      case "video":
        return (
          <div className="relative w-full bg-black/90 border-b border-border/50">
            <video
              src={fileState.previewUrl}
              controls
              preload="metadata"
              className="w-full max-h-60 object-contain"
              aria-label={`Video preview of ${fileState.file.name}`}
            >
              Your browser does not support video preview.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="relative w-full bg-muted/30 p-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Music className="h-5 w-5 text-pink-500" />
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {fileState.file.name}
              </p>
            </div>
            <audio
              src={fileState.previewUrl}
              controls
              preload="metadata"
              className="w-full h-10"
              aria-label={`Audio preview of ${fileState.file.name}`}
            >
              Your browser does not support audio preview.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div className="relative w-full border-b border-border/50 bg-white">
            <embed
              src={fileState.previewUrl}
              type="application/pdf"
              className="w-full h-80"
            />
          </div>
        );

      case "text":
        if (fileState.previewUrl.startsWith("text://")) {
          const textContent = fileState.previewUrl.slice(7);
          return (
            <div className="relative w-full bg-muted/20 border-b border-border/50 max-h-48 overflow-auto">
              <pre className="p-4 text-xs text-foreground/80 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {textContent}
              </pre>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="File upload drop zone. Click or drag files here to upload."
        className={`
          relative rounded-2xl border-2 border-dashed p-8 sm:p-10
          cursor-pointer transition-all duration-300 ease-out
          focus-ring outline-none
          ${isDragActive
            ? "border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptString}
          onChange={handleFileInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`
              p-4 rounded-2xl transition-all duration-300
              ${isDragActive ? "bg-primary/10 scale-110" : "bg-primary/5"}
            `}
          >
            <Upload
              className={`h-8 w-8 sm:h-10 sm:w-10 transition-colors duration-300 ${isDragActive ? "text-primary" : "text-muted-foreground"
                }`}
            />
          </div>

          <div className="space-y-2">
            <p className="text-base sm:text-lg font-semibold text-foreground">
              {isDragActive ? (
                <span className="text-primary">Drop your files here</span>
              ) : (
                <>
                  Drag & drop files here, or{" "}
                  <span className="text-primary underline underline-offset-4 decoration-primary/50">
                    browse
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {multiple
                ? `Up to ${maxFiles} files · Max ${maxSizeInMB}MB each`
                : `Max ${maxSizeInMB}MB`}
            </p>
            {acceptedFileTypes && acceptedFileTypes.length > 0 && (
              <p className="text-xs text-muted-foreground/70">
                Accepted:{" "}
                {acceptedFileTypes
                  .filter((t) => t.startsWith("."))
                  .join(", ") || acceptedFileTypes.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((fileState) => (
            <div
              key={fileState.id}
              className={`
                file-card-enter
                rounded-xl border transition-all duration-300 overflow-hidden
                ${fileState.status === "error"
                  ? "border-destructive/50 bg-destructive/5"
                  : fileState.status === "success"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/20"
                }
              `}
            >
              {/* File preview (image / video / audio / PDF / text) */}
              {fileState.status !== "error" && renderPreview(fileState)}

              {/* File info row */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                {/* File type icon */}
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  {getFileIcon(fileState.file)}
                </div>

                {/* File details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">
                      {fileState.file.name}
                    </p>
                    {fileState.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                    {fileState.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatFileSize(fileState.file.size)}
                    {fileState.previewType !== "none" &&
                      fileState.previewType !== "image" &&
                      ` · ${fileState.previewType.toUpperCase()}`}
                  </p>

                  {/* Error message */}
                  {fileState.error && (
                    <p className="text-xs text-destructive mt-1">
                      {fileState.error}
                    </p>
                  )}

                  {/* Progress bar */}
                  {(fileState.status === "uploading" ||
                    fileState.status === "success") && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ease-out ${fileState.status === "success"
                              ? "bg-primary"
                              : "bg-primary/70"
                              }`}
                            style={{ width: `${fileState.progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {fileState.status === "success"
                            ? "Ready"
                            : `${Math.round(fileState.progress)}%`}
                        </p>
                      </div>
                    )}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileState.id);
                  }}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors duration-200 group focus-ring flex-shrink-0"
                  aria-label={`Remove ${fileState.file.name}`}
                  title="Remove file"
                >
                  <X className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
