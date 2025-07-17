import { createSignal } from 'solid-js';
import type { FallbackConfig, UploadedFont } from '../types/font';

const [uploadedFont, setUploadedFont] = createSignal<UploadedFont | null>(null);
const [fallbackConfig, setFallbackConfig] = createSignal<FallbackConfig>({
  familyName: '',
  localFallback: 'Arial',
  sizeAdjust: 100
});

let previousFontUrl: string | null = null;

export const fontStore = {
  getUploadedFont: () => uploadedFont(),
  getFallbackConfig: () => fallbackConfig(),
  
  setUploadedFont: (font: UploadedFont) => {
    if (previousFontUrl) {
      URL.revokeObjectURL(previousFontUrl);
    }
    
    setUploadedFont(font);
    previousFontUrl = font.url;
    
    setFallbackConfig(prev => ({
      ...prev,
      familyName: `${font.name} Fallback`
    }));
  },
  
  updateFallbackConfig: (updates: Partial<FallbackConfig>) => {
    setFallbackConfig(prev => ({
      ...prev,
      ...updates
    }));
  },
  
  updateFallbackSettings: (localFallback: string, sizeAdjust: number) => {
    setFallbackConfig(prev => ({
      ...prev,
      localFallback,
      sizeAdjust
    }));
  },
  
  cleanup: () => {
    if (previousFontUrl) {
      URL.revokeObjectURL(previousFontUrl);
      previousFontUrl = null;
    }
    setUploadedFont(null);
    setFallbackConfig({
      familyName: '',
      localFallback: 'Arial',
      sizeAdjust: 100
    });
  }
};