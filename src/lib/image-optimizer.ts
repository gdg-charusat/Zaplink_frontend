import Compressor from 'compressorjs';

export type CompressionLevel = 'low' | 'medium' | 'high';

interface CompressionOptions {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    convertSize: number;
}

function getCompressionOptions(level: CompressionLevel): CompressionOptions {
    switch (level) {
        case 'low':
            return { maxWidth: 4000, maxHeight: 4000, quality: 0.9, convertSize: 5000000 };
        case 'high':
            return { maxWidth: 1500, maxHeight: 1500, quality: 0.7, convertSize: 500000 };
        default:
            return { maxWidth: 2048, maxHeight: 2048, quality: 0.8, convertSize: 1000000 };
    }
}

export function isOptimizableImage(file: File): boolean {
    const supportedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/bmp',
        'image/heic',
        'image/heif',
    ];
    return supportedTypes.includes(file.type.toLowerCase());
}

export async function optimizeImage(
    file: File,
    level: CompressionLevel = 'medium'
): Promise<File> {
    if (file.size < 100 * 1024) {
        return file;
    }

    if (!isOptimizableImage(file)) {
        console.warn('Unsupported image type for optimization:', file.type);
        return file;
    }

    const options = getCompressionOptions(level);

    return new Promise((resolve, reject) => {
        new Compressor(file, {
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            quality: options.quality,
            convertSize: options.convertSize,
            convertTypes: ['image/png', 'image/bmp'],
            mimeType: 'auto',
            checkOrientation: true,
            strict: true,
            success: (result: Blob) => {
                const optimizedFile = new File([result], file.name, {
                    type: result.type,
                    lastModified: Date.now(),
                });
                resolve(optimizedFile);
            },
            error: (err: Error) => {
                console.error('Image optimization failed:', err);
                reject(err);
            },
        });
    });
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function calculateReduction(originalSize: number, optimizedSize: number): number {
    if (originalSize === 0) return 0;
    return Math.round((1 - optimizedSize / originalSize) * 100);
}
