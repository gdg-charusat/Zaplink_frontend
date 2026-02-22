import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
    text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for browsers without clipboard API support
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy link"}
            title={copied ? "Copied!" : "Copy link"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 text-sm font-medium shrink-0 focus-ring"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Copy</span>
                </>
            )}
        </button>
    );
}
