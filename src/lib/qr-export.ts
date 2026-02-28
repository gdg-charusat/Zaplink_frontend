import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

export type ExportFormat = "png" | "svg" | "pdf" | "webp" | "jpeg";

export interface ExportOptions {
    format: ExportFormat;
    resolution: number; // For raster: 300-4000
    quality: number; // For lossy: 1-100
    includeFrame: boolean;
    includeLogo: boolean;
    fileName: string;
}

export const FORMAT_INFO: Record<
    ExportFormat,
    { label: string; description: string; ext: string; lossy: boolean }
> = {
    png: {
        label: "PNG",
        description: "Best for general use — crisp, lossless",
        ext: "png",
        lossy: false,
    },
    svg: {
        label: "SVG",
        description: "Scalable vector — perfect for print",
        ext: "svg",
        lossy: false,
    },
    pdf: {
        label: "PDF",
        description: "Print-ready A4 document",
        ext: "pdf",
        lossy: false,
    },
    webp: {
        label: "WebP",
        description: "Modern web format — smaller file size",
        ext: "webp",
        lossy: true,
    },
    jpeg: {
        label: "JPEG",
        description: "Universal compatibility",
        ext: "jpeg",
        lossy: true,
    },
};

export const RESOLUTION_PRESETS = [
    { label: "Low (300px)", value: 300, tag: "Web" },
    { label: "Medium (1000px)", value: 1000, tag: "Social" },
    { label: "High (2000px)", value: 2000, tag: "Print" },
    { label: "Ultra (4000px)", value: 4000, tag: "Banner" },
];

/**
 * Gets the SVG element from a QR container ref.
 */
function getSvgFromRef(qrRef: HTMLDivElement): SVGSVGElement | null {
    return qrRef.querySelector("svg");
}

/**
 * Serialize SVG element to string.
 */
function serializeSvg(svg: SVGSVGElement): string {
    return new XMLSerializer().serializeToString(svg);
}

/**
 * Render SVG to canvas at a given resolution.
 */
function renderToCanvas(
    svgData: string,
    resolution: number
): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = resolution;
            canvas.height = resolution;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Could not get canvas context"));
                return;
            }
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, resolution, resolution);
            ctx.drawImage(img, 0, 0, resolution, resolution);
            URL.revokeObjectURL(url);
            resolve(canvas);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load SVG"));
        };
        img.src = url;
    });
}

/**
 * Export QR code as SVG file.
 */
function exportAsSVG(svg: SVGSVGElement, fileName: string): void {
    const svgData = serializeSvg(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    saveAs(blob, `${fileName}.svg`);
}

/**
 * Export QR code as PDF (A4, centered).
 */
async function exportAsPDF(
    svg: SVGSVGElement,
    resolution: number,
    fileName: string
): Promise<void> {
    const svgData = serializeSvg(svg);
    const canvas = await renderToCanvas(svgData, resolution);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Center QR code on A4 page — use 100mm as QR size
    const qrSize = 100;
    const x = (pageWidth - qrSize) / 2;
    const y = (pageHeight - qrSize) / 2;

    pdf.addImage(imgData, "PNG", x, y, qrSize, qrSize);
    pdf.save(`${fileName}.pdf`);
}

/**
 * Export QR code as PNG at given resolution.
 */
async function exportAsPNG(
    svg: SVGSVGElement,
    resolution: number,
    fileName: string
): Promise<void> {
    const svgData = serializeSvg(svg);
    const canvas = await renderToCanvas(svgData, resolution);
    canvas.toBlob(
        (blob) => {
            if (blob) saveAs(blob, `${fileName}.png`);
        },
        "image/png",
        1
    );
}

/**
 * Export QR code as WebP at given resolution and quality.
 */
async function exportAsWebP(
    svg: SVGSVGElement,
    resolution: number,
    quality: number,
    fileName: string
): Promise<void> {
    const svgData = serializeSvg(svg);
    const canvas = await renderToCanvas(svgData, resolution);
    canvas.toBlob(
        (blob) => {
            if (blob) saveAs(blob, `${fileName}.webp`);
        },
        "image/webp",
        quality / 100
    );
}

/**
 * Export QR code as JPEG at given resolution and quality.
 */
async function exportAsJPEG(
    svg: SVGSVGElement,
    resolution: number,
    quality: number,
    fileName: string
): Promise<void> {
    const svgData = serializeSvg(svg);
    const canvas = await renderToCanvas(svgData, resolution);
    canvas.toBlob(
        (blob) => {
            if (blob) saveAs(blob, `${fileName}.jpeg`);
        },
        "image/jpeg",
        quality / 100
    );
}

/**
 * Estimate file size for a given format/resolution/quality combo (approximate KB).
 */
export function estimateFileSize(
    format: ExportFormat,
    resolution: number,
    quality: number
): string {
    let sizeKB: number;
    switch (format) {
        case "svg":
            sizeKB = 5; // SVGs are tiny ~3-7KB
            break;
        case "pdf":
            sizeKB = 100 + (resolution / 1000) * 60;
            break;
        case "png":
            sizeKB = (resolution / 300) ** 2 * 50;
            break;
        case "webp":
            sizeKB = ((resolution / 300) ** 2 * 50 * quality) / 100 * 0.4;
            break;
        case "jpeg":
            sizeKB = ((resolution / 300) ** 2 * 50 * quality) / 100 * 0.6;
            break;
        default:
            sizeKB = 200;
    }
    if (sizeKB >= 1024) {
        return `~${(sizeKB / 1024).toFixed(1)} MB`;
    }
    return `~${Math.round(sizeKB)} KB`;
}

/**
 * Main export function.
 */
export async function exportQRCode(
    qrRef: HTMLDivElement,
    options: ExportOptions
): Promise<void> {
    const svg = getSvgFromRef(qrRef);
    if (!svg) throw new Error("QR code SVG not found");

    const { format, resolution, quality, fileName } = options;

    switch (format) {
        case "svg":
            exportAsSVG(svg, fileName);
            break;
        case "pdf":
            await exportAsPDF(svg, resolution, fileName);
            break;
        case "png":
            await exportAsPNG(svg, resolution, fileName);
            break;
        case "webp":
            await exportAsWebP(svg, resolution, quality, fileName);
            break;
        case "jpeg":
            await exportAsJPEG(svg, resolution, quality, fileName);
            break;
    }
}

/**
 * Batch export all formats as individual downloads.
 */
export async function batchExport(
    qrRef: HTMLDivElement,
    fileName: string,
    resolution: number,
    quality: number
): Promise<void> {
    const formats: ExportFormat[] = ["png", "svg", "pdf", "webp", "jpeg"];
    for (const format of formats) {
        await exportQRCode(qrRef, {
            format,
            resolution,
            quality,
            includeFrame: true,
            includeLogo: true,
            fileName,
        });
        // Small delay between downloads to avoid browser blocking
        await new Promise((r) => setTimeout(r, 300));
    }
}
