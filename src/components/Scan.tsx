import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Image as ImageIcon, Upload, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import jsQR from "jsqr";
import { toast } from "sonner";

type ScanState = "idle" | "scanning" | "success" | "error";

export default function Scan() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [scanMethod, setScanMethod] = useState<"camera" | "image">("camera");
  const [isDragActive, setIsDragActive] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (error) {
      console.error("Audio playback restricted or failed:", error);
    }
  };

  const handleSuccessfulScan = useCallback((data: string) => {
    if (scanState === "success") return;

    setScanState("success");
    playBeep();
    stopCamera();

    toast.success("QR Code detected successfully!");

    // Redirect after a brief moment to show success state
    setTimeout(() => {
      // If it's a URL, we can redirect. Otherwise, just show the text or navigate.
      try {
        const url = new URL(data);
        window.location.href = url.href;
      } catch (e) {
        // Not a valid URL, maybe just text
        toast.info(`Decoded text: ${data}`);
        // Reset state after showing text
        setTimeout(() => setScanState("idle"), 3000);
      }
    }, 800);
  }, [scanState]);

  const tick = useCallback(() => {
    if (
      videoRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
      canvasRef.current
    ) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Match canvas dimensions to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          handleSuccessfulScan(code.data);
          return; // Stop processing once found
        }
      }
    }

    if (scanState === "scanning") {
      requestRef.current = requestAnimationFrame(tick);
    }
  }, [scanState, handleSuccessfulScan]);

  const getCameras = async () => {
    try {
      // Need to ask for permission first to get labels
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setCameras(videoDevices);

      // Select the back camera if available, otherwise the first one
      const backCamera = videoDevices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
      if (backCamera) {
        setSelectedCameraId(backCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setSelectedCameraId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error accessing camera devices:", err);
      setErrorMessage("Could not access camera permissions.");
      setScanState("error");
    }
  };

  const startCamera = async (deviceId?: string) => {
    stopCamera();
    setErrorMessage("");
    setScanState("scanning");

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        videoRef.current.play();
        requestRef.current = requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.error("Error starting camera:", err);
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        setErrorMessage("Camera access was denied. Please update your browser permissions.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No camera found on this device.");
      } else {
        setErrorMessage("Failed to start the camera. Please try another method.");
      }
      setScanState("error");
    }
  };

  const stopCamera = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    // Only fetch cameras on mount if camera method is selected
    if (scanMethod === "camera") {
      getCameras().then(() => {
        // startCamera is called after cameras are fetched if we have them
      });
    }

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (scanMethod === "camera" && selectedCameraId && scanState !== "success") {
      startCamera(selectedCameraId);
    } else {
      stopCamera();
      if (scanMethod === "image") {
        setScanState("idle");
        setErrorMessage("");
      }
    }
  }, [scanMethod, selectedCameraId]);

  // Handle Image File Selection
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setScanState("scanning");
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setErrorMessage("Failed to process image.");
          setScanState("error");
          return;
        }

        // Scale down large images to prevent memory issues and speed up decoding
        const MAX_DIMENSION = 1000;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          handleSuccessfulScan(code.data);
        } else {
          setErrorMessage("No valid QR code found in this image.");
          setScanState("error");
        }
      };
      img.onerror = () => {
        setErrorMessage("Failed to load image.");
        setScanState("error");
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      setErrorMessage("Error reading file.");
      setScanState("error");
    };

    reader.readAsDataURL(file);
  };

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center">
      <div className="w-full text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Scan <span className="gradient-text-primary">Zap</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Point your camera at a QR code or upload an image to instantly decode and visit the link.
        </p>
      </div>

      <div className="bg-card w-full border border-border/50 rounded-2xl shadow-xl overflow-hidden glass-card">
        {/* Method Toggle */}
        <div className="flex border-b border-border/50">
          <button
            onClick={() => setScanMethod("camera")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${scanMethod === "camera"
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:bg-muted/50"
              }`}
          >
            <Camera className="w-5 h-5" />
            Webcam
          </button>
          <button
            onClick={() => setScanMethod("image")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-all ${scanMethod === "image"
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:bg-muted/50"
              }`}
          >
            <ImageIcon className="w-5 h-5" />
            Upload Image
          </button>
        </div>

        <div className="p-6">
          {scanMethod === "camera" ? (
            <div className="flex flex-col items-center">
              {cameras.length > 1 && (
                <div className="w-full mb-4 flex justify-end">
                  <select
                    value={selectedCameraId}
                    onChange={(e) => setSelectedCameraId(e.target.value)}
                    className="p-2 border border-border bg-background rounded-lg text-sm text-foreground focus:ring-primary"
                  >
                    {cameras.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative w-full max-w-sm aspect-square bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-border">
                {scanState === "error" ? (
                  <div className="text-center p-6 text-muted-foreground flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                    <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                    <button
                      onClick={() => startCamera(selectedCameraId)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Try Again
                    </button>
                  </div>
                ) : scanState === "success" ? (
                  <div className="text-center p-6 text-green-500 flex flex-col items-center gap-4 bg-green-500/10 w-full h-full justify-center">
                    <CheckCircle2 className="w-16 h-16 animate-bounce" />
                    <p className="text-lg font-bold">QR Code Found!</p>
                    <p className="text-sm">Redirecting...</p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Viewfinder UI */}
                    <div className="absolute inset-0 z-10 box-border border-[40px] border-black/40 pointer-events-none transition-all">
                      <div className="absolute inset-0 border-2 border-primary/80 rounded-sm">
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg -mb-1 -mr-1"></div>

                        {/* Animated Scanning Line */}
                        <div className="w-full h-0.5 bg-primary/80 absolute top-0 left-0 animate-scan-line shadow-[0_0_8px_2px_rgba(var(--primary),0.6)]"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
                <Camera className="w-4 h-4" /> Position the QR code within the frame
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[350px]">
              <div
                className={`w-full max-w-sm aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all ${isDragActive
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border hover:border-primary/50 hover:bg-muted/20"
                  }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {scanState === "success" ? (
                  <div className="text-center text-green-500 flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-16 h-16 animate-bounce" />
                    <p className="text-lg font-bold">QR Code Found!</p>
                    <p className="text-sm">Redirecting...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                      <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload a QR Code</h3>
                    <p className="text-center text-muted-foreground text-sm mb-6">
                      Drag & drop an image file here, or click to select from your device
                    </p>

                    {scanState === "error" && (
                      <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg shadow-md hover:bg-primary/90 transition-colors focus-ring">
                      Browse Files
                    </button>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processImageFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
