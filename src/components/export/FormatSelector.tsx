import type { ExportFormat } from "../../lib/qr-export";
import {
    FORMAT_INFO,
} from "../../lib/qr-export";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { FileImage, FileText, FileCode, Image, FileType } from "lucide-react";

const FORMAT_ICONS: Record<ExportFormat, React.ElementType> = {
    png: FileImage,
    svg: FileCode,
    pdf: FileText,
    webp: Image,
    jpeg: FileType,
};

interface FormatSelectorProps {
    value: ExportFormat;
    onChange: (format: ExportFormat) => void;
}

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
    const Icon = FORMAT_ICONS[value];

    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Export Format
            </Label>
            <Select value={value} onValueChange={(v) => onChange(v as ExportFormat)}>
                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-background text-foreground font-medium focus-ring">
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Select format" />
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-card text-foreground shadow-2xl">
                    {(Object.keys(FORMAT_INFO) as ExportFormat[]).map((fmt) => {
                        const info = FORMAT_INFO[fmt];
                        const FmtIcon = FORMAT_ICONS[fmt];
                        return (
                            <SelectItem key={fmt} value={fmt} className="rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FmtIcon className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <span className="font-medium">{info.label}</span>
                                        <span className="text-xs text-muted-foreground ml-2">
                                            — {info.description}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
