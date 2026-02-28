import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { type CompressionLevel, formatBytes, calculateReduction } from "../lib/image-optimizer";

interface ImageCompressionControlProps {
    level: CompressionLevel;
    onChange: (level: CompressionLevel) => void;
    originalSize?: number;
    optimizedSize?: number;
    isOptimizing?: boolean;
}

export function ImageCompressionControl({
    level,
    onChange,
    originalSize = 0,
    optimizedSize = 0,
    isOptimizing = false,
}: ImageCompressionControlProps) {
    const reduction = calculateReduction(originalSize, optimizedSize);
    const hasOptimizationResult = originalSize > 0 && optimizedSize > 0;

    return (
        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">Image Compression</Label>
                </div>
                {hasOptimizationResult && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        {reduction}% smaller
                    </span>
                )}
                {isOptimizing && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                        Optimizing...
                    </span>
                )}
            </div>

            <RadioGroup
                value={level}
                onValueChange={(value) => onChange(value as CompressionLevel)}
                className="space-y-2"
            >
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="low" id="compression-low" />
                    <Label
                        htmlFor="compression-low"
                        className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Low</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Best quality (~2MB)</span>
                    </Label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors bg-primary/5 border border-primary/20">
                    <RadioGroupItem value="medium" id="compression-medium" />
                    <Label
                        htmlFor="compression-medium"
                        className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Medium</span>
                            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                                Recommended
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Balanced (~800KB)</span>
                    </Label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="high" id="compression-high" />
                    <Label
                        htmlFor="compression-high"
                        className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">High</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Smallest (~300KB)</span>
                    </Label>
                </div>
            </RadioGroup>

            {hasOptimizationResult && (
                <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Original: {formatBytes(originalSize)}</span>
                        <span>→</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                            Optimized: {formatBytes(optimizedSize)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageCompressionControl;
