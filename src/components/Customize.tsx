import React, { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Upload, Download, Copy, Share2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { toast } from "sonner"

type FrameOption = "none" | "rounded" | "circle" | "shadow"
type PatternOption = "squares" | "dots" | "rounded"

export default function CustomizePage() {
  const [frameStyle, setFrameStyle] = useState<FrameOption>("none")
  const [patternStyle, setPatternStyle] = useState<PatternOption>("squares")
  const [logo, setLogo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Example QR code value
  const qrValue = "https://qrcreate.example.com/demo123"

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) setLogo(event.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  const getFrameStyle = (): React.CSSProperties => {
    switch (frameStyle) {
      case "rounded":
        return { borderRadius: 12, padding: 20, background: "#f9fafb" }
      case "circle":
        return { borderRadius: "50%", padding: 20, background: "#f9fafb" }
      case "shadow":
        return { boxShadow: "0 8px 20px rgba(0,0,0,0.08)", padding: 20, background: "#fff" }
      default:
        return {}
    }
  }

  const handleDownload = () => {
    // TODO: implement actual download logic
    toast.success("Your QR code has been downloaded successfully.")
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue)
    toast.success("Short link has been copied to clipboard.")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My QR Code",
          text: "Check out my QR code",
          url: qrValue,
        })
        .catch(() => toast.error("Error sharing, please try again."))
    } else {
      toast.error("Sharing is not supported on this browser.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Customize Your QR Code
            </h1>
          </div>
        </div>
      </header>

      
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Two-column layout: Preview on left, Controls on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Preview Card */}
            <div className="flex flex-col items-center justify-center">
              <div
                className="bg-white p-6 rounded-xl border flex items-center justify-center transition-all"
                style={getFrameStyle()}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={240}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          height: 50,
                          width: 50,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">Scan to preview your QR code</p>
            </div>

            {/* Customization Controls */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Design Options</h2>

              {/* Frame Style Selector */}
              <div className="space-y-2">
                <Label htmlFor="frame-style" className="text-base font-medium text-gray-700">
                  Frame Style
                </Label>
                <Select
                  value={frameStyle}
                  onValueChange={(value: string) => setFrameStyle(value as FrameOption)}
                >
                  <SelectTrigger id="frame-style" className="w-full rounded-md border-gray-300">
                    <SelectValue placeholder="Select frame style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="shadow">Shadow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pattern Style */}
              <div className="space-y-2">
                <Label className="text-base font-medium text-gray-700">Pattern Style</Label>
                <RadioGroup
                  value={patternStyle}
                  onValueChange={(value: string) => setPatternStyle(value as PatternOption)}
                  className="grid grid-cols-3 gap-4"
                >
                  {[
                    {
                      value: "squares",
                      label: "Squares",
                      demo: (
                        <div className="w-12 h-12 bg-gray-800" />
                      ),
                    },
                    {
                      value: "dots",
                      label: "Dots",
                      demo: (
                        <div className="w-12 h-12 rounded-full bg-gray-800" />
                      ),
                    },
                    {
                      value: "rounded",
                      label: "Rounded",
                      demo: (
                        <div className="w-12 h-12 rounded-lg bg-gray-800" />
                      ),
                    },
                  ].map((option) => (
                    <div key={option.value} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "border-2 rounded p-2 cursor-pointer transition-all",
                          patternStyle === option.value
                            ? "border-blue-600"
                            : "border-gray-300"
                        )}
                      >
                        {option.demo}
                      </div>
                      <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      <Label htmlFor={option.value} className="text-xs mt-1 text-gray-700">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-base font-medium text-gray-700">
                  Upload Logo (optional)
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-md border-gray-300 text-gray-700 hover:border-gray-400"
                  >
                    <Upload className="h-4 w-4" />
                    {logo ? "Change Logo" : "Upload Logo"}
                  </Button>
                  {logo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogo(null)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      Remove
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {logo && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-md" />
                    <span className="text-sm text-gray-500">Logo added</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 border-t pt-6 flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:ring focus:ring-blue-200"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:border-gray-400"
            >
              <Copy className="h-4 w-4" />
              Copy Short Link
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:border-gray-400"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
