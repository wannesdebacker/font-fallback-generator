export interface FallbackConfig {
  familyName: string;
  localFallback: string;
  sizeAdjust: number;
}

export interface FontMetrics {
  height: number;
  width: number;
}

export interface UploadedFont {
  name: string;
  url: string;
  file: File;
}