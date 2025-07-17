import { createSignal, type Component } from 'solid-js';
import { loadFont } from '../../utils/fontUtils';
import { fontStore } from '../../stores/fontStore';
import { UploadIcon } from '../Icons/UploadIcon';
import './FontUploader.css';

export const FontUploader: Component = () => {
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  
  let fileInputRef: HTMLInputElement | undefined;

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const uploadedFont = await loadFont(file);
      fontStore.setUploadedFont(uploadedFont);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load font');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      handleFileSelect(target.files[0]);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef?.click();
  };

  const handleDropZoneKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef?.click();
    }
  };

  const uploadedFont = () => fontStore.getUploadedFont();

  return (
    <div class="font-uploader">
      <h2 class="font-uploader__title">Upload Font</h2>
      
      <div 
        class={`font-uploader__drop-zone ${isDragOver() ? 'font-uploader__drop-zone--active' : ''} ${isUploading() ? 'font-uploader__drop-zone--uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
        onKeyDown={handleDropZoneKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Upload font file or drag and drop"
        aria-describedby="upload-description"
      >
        <div class="font-uploader__icon" aria-hidden="true">
          <UploadIcon />
        </div>
        
        {uploadedFont() ? (
          <div class="font-uploader__success" role="status" aria-live="polite">
            <p class="font-uploader__filename">{uploadedFont()!.name}</p>
            <p class="font-uploader__message">Font uploaded successfully!</p>
          </div>
        ) : isUploading() ? (
          <div class="font-uploader__uploading" role="status" aria-live="polite">
            <p class="font-uploader__primary-text">Uploading font...</p>
          </div>
        ) : (
          <div class="font-uploader__prompt">
            <p class="font-uploader__primary-text">
              Drop your font file here or click to browse
            </p>
            <p class="font-uploader__secondary-text" id="upload-description">
              Supports .woff2, .woff, .ttf, .otf formats
            </p>
          </div>
        )}
      </div>

      {error() && (
        <div class="font-uploader__error" role="alert" aria-live="assertive">
          <p class="font-uploader__error-message">{error()}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        class="font-uploader__input"
        accept=".woff2,.woff,.ttf,.otf"
        onChange={handleFileInputChange}
        aria-label="Select font file"
      />
    </div>
  );
};