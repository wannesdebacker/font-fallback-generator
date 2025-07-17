import { createSignal, createEffect, Show, For, type Component } from 'solid-js';
import { fontStore } from '../../stores/fontStore';
import { SAMPLE_TEXT, SYSTEM_FONTS } from '../../data/sampleText';
import { findOptimalSizeAdjust, checkHeightMatch } from '../../utils/fontUtils';
import './FontComparison.css';

export const FontComparison: Component = () => {
  const [selectedFallback, setSelectedFallback] = createSignal('Arial');
  const [sizeAdjust, setSizeAdjust] = createSignal(100);
  const [fontSize, setFontSize] = createSignal(16);
  const [viewMode, setViewMode] = createSignal<'side-by-side' | 'overlay'>('side-by-side');
  const [fallbackOpacity, setFallbackOpacity] = createSignal(50);
  const [isCalculating, setIsCalculating] = createSignal(false);
  const [isHeightMatched, setIsHeightMatched] = createSignal(false);

  let originalSampleRef: HTMLDivElement | undefined;
  let fallbackSampleRef: HTMLDivElement | undefined;

  const calculateFallback = async () => {
    const uploadedFont = fontStore.getUploadedFont();
    if (!uploadedFont || !originalSampleRef || !fallbackSampleRef) return;

    setIsCalculating(true);

    try {
      const optimalSizeAdjust = findOptimalSizeAdjust(
        originalSampleRef,
        fallbackSampleRef,
        uploadedFont.name,
        selectedFallback(),
        fontSize()
      );
      
      setSizeAdjust(optimalSizeAdjust);
      fontStore.updateFallbackSettings(selectedFallback(), optimalSizeAdjust);
    } catch (error) {
      console.error('Error calculating fallback:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const checkMatch = () => {
    if (!originalSampleRef || !fallbackSampleRef || viewMode() !== 'side-by-side') {
      return;
    }

    const matched = checkHeightMatch(originalSampleRef, fallbackSampleRef);
    setIsHeightMatched(matched);
  };

  const handleViewModeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setViewMode(target.value as 'side-by-side' | 'overlay');
  };

  const handleFallbackChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setSelectedFallback(target.value);
    setTimeout(calculateFallback, 50);
  };

  const handleSizeAdjustChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    setSizeAdjust(value);
  };

  const handleFontSizeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFontSize(parseInt(target.value));
  };

  const handleOpacityChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFallbackOpacity(parseInt(target.value));
  };

  createEffect(() => {
    const uploadedFont = fontStore.getUploadedFont();
    if (uploadedFont) {
      setTimeout(calculateFallback, 100);
    }
  });

  createEffect(() => {
    fontStore.updateFallbackSettings(selectedFallback(), sizeAdjust());
  });

  createEffect(() => {
    sizeAdjust();
    fontSize();
    selectedFallback();
    setTimeout(checkMatch, 50);
  });

  const uploadedFont = () => fontStore.getUploadedFont();

  return (
    <Show when={uploadedFont()}>
      <div class={`font-comparison ${isHeightMatched() && viewMode() === 'side-by-side' ? 'font-comparison--matched' : ''}`}>
        <div class="font-comparison__controls">
          <h2 class="font-comparison__title">
            Font Comparison
            <Show when={isCalculating()}>
              <span class="font-comparison__loading" aria-live="polite">Calculating...</span>
            </Show>
          </h2>

          <div class="font-comparison__control-group">
            <label class="font-comparison__label" for="view-mode-select">
              <span class="font-comparison__label-text">View Mode:</span>
              <select
                id="view-mode-select"
                class="font-comparison__select"
                value={viewMode()}
                onChange={handleViewModeChange}
                aria-describedby="view-mode-desc"
              >
                <option value="side-by-side">Side by Side</option>
                <option value="overlay">Overlay</option>
              </select>
            </label>
            <div id="view-mode-desc" class="font-comparison__description">
              Choose how to compare the original and fallback fonts
            </div>
          </div>

          <div class="font-comparison__control-group">
            <label class="font-comparison__label" for="fallback-font-select">
              <span class="font-comparison__label-text">Fallback Font:</span>
              <select
                id="fallback-font-select"
                class="font-comparison__select"
                value={selectedFallback()}
                onChange={handleFallbackChange}
                aria-describedby="fallback-desc"
              >
                <For each={SYSTEM_FONTS}>
                  {(font) => <option value={font}>{font}</option>}
                </For>
              </select>
            </label>
            <div id="fallback-desc" class="font-comparison__description">
              System font to use as fallback when main font fails to load
            </div>
          </div>

          <div class="font-comparison__control-group">
            <label class="font-comparison__label">
              <span class="font-comparison__label-text">Size Adjust:</span>
              <span class="font-comparison__label-value">{sizeAdjust()}%</span>
            </label>
            <input
              type="range"
              class="font-comparison__slider"
              min="50"
              max="150"
              step="0.1"
              value={sizeAdjust()}
              onInput={handleSizeAdjustChange}
              aria-label={`Size adjust: ${sizeAdjust()}%`}
              aria-describedby="size-adjust-desc"
            />
            <div id="size-adjust-desc" class="font-comparison__description">
              Adjust fallback font size to match original font height
            </div>
          </div>

          <div class="font-comparison__control-group">
            <label class="font-comparison__label">
              <span class="font-comparison__label-text">Base Font Size:</span>
              <span class="font-comparison__label-value">{fontSize()}px</span>
            </label>
            <input
              type="range"
              class="font-comparison__slider"
              min="14"
              max="20"
              value={fontSize()}
              onInput={handleFontSizeChange}
              aria-label={`Base font size: ${fontSize()} pixels`}
              aria-describedby="font-size-desc"
            />
            <div id="font-size-desc" class="font-comparison__description">
              Base font size for comparison preview
            </div>
          </div>

          <button
            class="font-comparison__recalc-btn"
            onClick={calculateFallback}
            disabled={isCalculating() || !uploadedFont()}
            aria-describedby="recalc-desc"
          >
            {isCalculating() ? 'Calculating...' : 'Recalculate'}
          </button>
          <div id="recalc-desc" class="font-comparison__description">
            Automatically calculate optimal size adjust value
          </div>
        </div>

        <div class={`font-comparison__preview font-comparison__preview--${viewMode()}`}>
          <Show when={viewMode() === 'overlay'}>
            <div class="font-comparison__overlay-container">
              <div class="font-comparison__overlay-controls">
                <label class="font-comparison__overlay-label">
                  <span>Fallback Opacity:</span>
                  <input
                    type="range"
                    class="font-comparison__slider"
                    min="0"
                    max="100"
                    value={fallbackOpacity()}
                    onInput={handleOpacityChange}
                    aria-label={`Fallback opacity: ${fallbackOpacity()}%`}
                  />
                  <span>{fallbackOpacity()}%</span>
                </label>
              </div>

              <div class="font-comparison__overlay-wrapper">
                <div
                  ref={originalSampleRef}
                  class="font-comparison__sample-text font-comparison__overlay-original"
                  style={{
                    'font-family': uploadedFont()?.name || 'sans-serif',
                    'font-size': `${fontSize()}px`
                  }}
                  innerHTML={SAMPLE_TEXT}
                />

                <div
                  ref={fallbackSampleRef}
                  class="font-comparison__sample-text font-comparison__overlay-fallback"
                  style={{
                    'font-family': selectedFallback(),
                    'font-size': `${fontSize() * (sizeAdjust() / 100)}px`,
                    'opacity': fallbackOpacity() / 100
                  }}
                  innerHTML={SAMPLE_TEXT}
                />
              </div>
            </div>
          </Show>

          <Show when={viewMode() === 'side-by-side'}>
            <div class="font-comparison__sample">
              <h3 class="font-comparison__sample-title">
                Original Font ({uploadedFont()?.name})
              </h3>
              <div
                ref={originalSampleRef}
                class="font-comparison__sample-text"
                style={{
                  'font-family': uploadedFont()?.name || 'sans-serif',
                  'font-size': `${fontSize()}px`
                }}
                innerHTML={SAMPLE_TEXT}
              />
            </div>

            <div class="font-comparison__sample">
              <h3 class="font-comparison__sample-title">
                Fallback Font ({selectedFallback()} at {sizeAdjust()}%)
                <Show when={isHeightMatched()}>
                  <span class="font-comparison__optimized">✓ Matched</span>
                </Show>
              </h3>
              <div
                ref={fallbackSampleRef}
                class="font-comparison__sample-text"
                style={{
                  'font-family': selectedFallback(),
                  'font-size': `${fontSize() * (sizeAdjust() / 100)}px`
                }}
                innerHTML={SAMPLE_TEXT}
              />
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};