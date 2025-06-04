import React, { useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Upload, FileIcon, X } from "lucide-react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

export default function UploadPage() {
  const navigate = useNavigate()
  const [qrName, setQrName] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [passwordProtect, setPasswordProtect] = useState(false)
  const [password, setPassword] = useState("")
  const [selfDestruct, setSelfDestruct] = useState(false)
  const [destructType, setDestructType] = useState("views")
  const [destructValue, setDestructValue] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setUploadedFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const canGenerate =
    qrName.trim() &&
    uploadedFile &&
    (!passwordProtect || password.trim()) &&
    (!selfDestruct || destructValue.trim())

  const handleGenerateAndContinue = () => {
    // In a real app, you would handle the file upload here
    // For now, we'll just navigate to the customize page
    navigate("/customize")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Upload Your Content
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Step 2 of 3</span>
            <div className="flex-1 mx-4 h-0.5 bg-gray-200">
              <div className="h-0.5 bg-blue-600 w-2/3" />
            </div>
            <span className="text-sm text-gray-500">Customize →</span>
          </div>

          {/* QR Code Name */}
          <div className="space-y-2">
            <Label htmlFor="qr-name" className="text-base font-medium text-gray-700">
              Name your QR Code
            </Label>
            <Input
              id="qr-name"
              placeholder="Enter a name for your QR code"
              value={qrName}
              onChange={(e) => setQrName(e.target.value)}
              className="text-base rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Upload Area */}
          <div className="space-y-2">
            <Label className="text-base font-medium text-gray-700">
              Upload Content
            </Label>
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer bg-gray-50",
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.txt"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports: PDF, DOC, DOCX, PPT, PPTX, Images, ZIP, TXT, etc.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 flex items-center gap-4 bg-gray-100">
                <FileIcon className="h-8 w-8 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="text-gray-600 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Optional Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Optional Settings</h3>

            {/* Password Protection */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="password-protect"
                  checked={passwordProtect}
                  onCheckedChange={(checked) => {
                    setPasswordProtect(checked as boolean)
                    if (!checked) setPassword("")
                  }}
                />
                <Label htmlFor="password-protect" className="text-sm font-medium text-gray-700">
                  Password protect QR code
                </Label>
              </div>
              {passwordProtect && (
                <Input
                  type="password"
                  placeholder="Enter a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-6 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              )}
            </div>

            {/* Self-Destruct */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="self-destruct"
                  checked={selfDestruct}
                  onCheckedChange={(checked) => {
                    setSelfDestruct(checked as boolean)
                    if (!checked) setDestructValue("")
                  }}
                />
                <Label htmlFor="self-destruct" className="text-sm font-medium text-gray-700">
                  Self-destruct
                </Label>
              </div>
              {selfDestruct && (
                <div className="ml-6 space-y-4">
                  <RadioGroup
                    value={destructType}
                    onValueChange={setDestructType}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="views" id="views" />
                      <Label htmlFor="views" className="text-sm text-gray-700">
                        After
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={destructType === "views" ? destructValue : ""}
                        onChange={(e) => {
                          if (destructType === "views") setDestructValue(e.target.value)
                        }}
                        className="w-20 h-8 text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        min="1"
                      />
                      <Label htmlFor="views" className="text-sm text-gray-700">
                        views
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hours" id="hours" />
                      <Label htmlFor="hours" className="text-sm text-gray-700">
                        After
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={destructType === "hours" ? destructValue : ""}
                        onChange={(e) => {
                          if (destructType === "hours") setDestructValue(e.target.value)
                        }}
                        className="w-20 h-8 text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        min="1"
                      />
                      <Label htmlFor="hours" className="text-sm text-gray-700">
                        hours
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              size="lg"
              disabled={!canGenerate}
              onClick={handleGenerateAndContinue}
              className={cn(
                "w-full rounded-lg text-white text-base font-medium transition-all",
                canGenerate
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-200"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              Generate Link & Continue <span className="ml-2 transform rotate-0">➔</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
