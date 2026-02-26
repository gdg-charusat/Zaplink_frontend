import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  LinkIcon,
  Type,
  FileXIcon as DocxIcon,
  Presentation,
  Upload,
} from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export default function Page() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const contentTypes = [
    { id: "pdf", label: "PDF", icon: FileText },
    { id: "image", label: "Image", icon: ImageIcon },
    { id: "video", label: "Video", icon: Video },
    { id: "audio", label: "Audio", icon: Music },
    { id: "zip", label: "ZIP", icon: Archive },
    { id: "url", label: "URL", icon: LinkIcon },
    { id: "text", label: "Text", icon: Type },
    { id: "docx", label: "DOCX", icon: DocxIcon },
    { id: "pptx", label: "PPTX", icon: Presentation },
    { id: "universal", label: "Universal Upload", icon: Upload },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What do you want to create a QR code for?
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedOption(type.id)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-all",
                "hover:border-primary hover:shadow-sm",
                selectedOption === type.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background"
              )}
            >
              <type.icon
                className={cn(
                  "h-8 w-8 transition-colors",
                  selectedOption === type.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  selectedOption === type.id
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {type.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" disabled={!selectedOption} className="px-8" asChild>
            <Link to={selectedOption ? "/upload" : "#"}>
              Continue <span className="ml-2">➔</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
