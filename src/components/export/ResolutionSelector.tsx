import { RESOLUTION_PRESETS } from "../../lib/qr-export";
import { Label } from "../ui/label";
import { Monitor, Smartphone, Printer, Maximize } from "lucide-react";

const RESOLUTION_ICONS = [Smartphone, Monitor, Printer, Maximize];

interface ResolutionSelectorProps {
    value: number;
    onChange: (resolution: number) => void;
    disabled?: boolean;
}

export default function ResolutionSelector({
    value,
    onChange,
    disabled = false,
}: ResolutionSelectorProps) {
    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Resolution
            </Label>
            <div className="grid grid-cols-2 gap-3">
                {RESOLUTION_PRESETS.map((preset, i) => {
                    const Icon = RESOLUTION_ICONS[i];
                    const isActive = value === preset.value;
                    return (
                        <button
                            key={preset.value}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(preset.value)}
                            className={`
                relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                ${isActive
                                    ? "border-primary bg-primary/10 shadow-md"
                                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
                        >
                            <Icon
                                className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                            />
                            <div className="text-left">
                                <p
                                    className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"
                                        }`}
                                >
                                    {preset.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{preset.tag}</p>
                            </div>
                            {isActive && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
