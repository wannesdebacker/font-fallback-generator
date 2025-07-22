import type { UploadedFont, FontMetrics } from '../types/font';

export const isSupportedFontType = (file: File): boolean => {
  const supportedTypes = ['font/woff2', 'font/woff', 'font/ttf', 'font/otf'];
  const supportedExtensions = ['.woff2', '.woff', '.ttf', '.otf'];
  
  return supportedTypes.includes(file.type) || 
         supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

export const loadFont = async (file: File): Promise<UploadedFont> => {
  if (!isSupportedFontType(file)) {
    throw new Error('Unsupported font file type. Please use .woff2, .woff, .ttf, or .otf files.');
  }
  
  const url = URL.createObjectURL(file);
  const name = file.name.replace(/\.[^/.]+$/, '');
  
  try {
    // Create and load font face
    const fontFace = new FontFace(name, `url(${url})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    
    return { name, url, file };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw new Error(`Failed to load font: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create font-face with size-adjust and return the adjusted font family name
export const createAdjustedFontFace = (
  fallbackFont: string, 
  sizeAdjust: number
): string => {
  const adjustedFamilyName = `${fallbackFont}-adjusted-${Date.now()}`;
  
  // Remove any existing style with this font
  const existingStyle = document.querySelector(`style[data-font="${adjustedFamilyName}"]`);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new font-face with size-adjust
  const css = `
@font-face {
  font-family: '${adjustedFamilyName}';
  src: local('${fallbackFont}');
  size-adjust: ${sizeAdjust}%;
  font-display: swap;
}`;

  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-font', adjustedFamilyName);
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  
  return adjustedFamilyName;
};

export const measureFontMetrics = (
  element: HTMLElement,
  fontFamily: string,
  fontSize: number
): FontMetrics => {
  const originalStyle = {
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize
  };
  
  // Apply font styles (same font size for both!)
  element.style.fontFamily = fontFamily;
  element.style.fontSize = `${fontSize}px`;
  
  // Force reflow
  element.offsetHeight;
  
  // Measure dimensions
  const metrics = {
    height: element.scrollHeight,
    width: element.scrollWidth
  };
  
  // Restore original styles
  element.style.fontFamily = originalStyle.fontFamily;
  element.style.fontSize = originalStyle.fontSize;
  
  return metrics;
};

export const findOptimalSizeAdjust = async (
  originalElement: HTMLElement,
  fallbackElement: HTMLElement,
  originalFontFamily: string,
  fallbackFontFamily: string,
  fontSize: number
): Promise<number> => {
  // Get original font metrics
  const originalMetrics = measureFontMetrics(originalElement, originalFontFamily, fontSize);
  
  // Binary search for optimal size adjust
  let low = 50;
  let high = 150;
  let bestSizeAdjust = 100;
  let smallestDifference = Infinity;
  
  for (let i = 0; i < 25; i++) {
    const testSizeAdjust = (low + high) / 2;
    
    // Create adjusted font-face
    const adjustedFontFamily = createAdjustedFontFace(fallbackFontFamily, testSizeAdjust);
    
    // Wait a bit for font to load
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Measure with adjusted font (same font size!)
    const fallbackMetrics = measureFontMetrics(fallbackElement, adjustedFontFamily, fontSize);
    
    const heightDiff = fallbackMetrics.height - originalMetrics.height;
    const absDiff = Math.abs(heightDiff);
    
    if (absDiff < smallestDifference) {
      smallestDifference = absDiff;
      bestSizeAdjust = testSizeAdjust;
    }
    
    if (heightDiff > 0) {
      high = testSizeAdjust;
    } else {
      low = testSizeAdjust;
    }
    
    if (absDiff < 1) break;
  }
  
  return Math.round(bestSizeAdjust * 10) / 10;
};

export const checkHeightMatch = (
  element1: HTMLElement,
  element2: HTMLElement,
  threshold: number = 0.01
): boolean => {
  const height1 = element1.scrollHeight;
  const height2 = element2.scrollHeight;
  const heightDiff = Math.abs(height1 - height2);
  const maxHeight = Math.max(height1, height2);
  
  return heightDiff <= maxHeight * threshold;
};