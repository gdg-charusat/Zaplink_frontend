declare module "jsqr" {
  type QRLocationPoint = {
    x: number;
    y: number;
  };

  type QRCode = {
    binaryData: number[];
    data: string;
    location: {
      topRightCorner: QRLocationPoint;
      topLeftCorner: QRLocationPoint;
      bottomRightCorner: QRLocationPoint;
      bottomLeftCorner: QRLocationPoint;
      topRightFinderPattern: QRLocationPoint;
      topLeftFinderPattern: QRLocationPoint;
      bottomLeftFinderPattern: QRLocationPoint;
      bottomRightAlignmentPattern?: QRLocationPoint;
    };
    chunks?: Array<{ type: string; text: string }>;
    version?: number;
  };

  type Options = {
    inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst";
  };

  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: Options
  ): QRCode | null;
}
