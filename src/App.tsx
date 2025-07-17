
import { createSignal, createEffect, type Component } from 'solid-js';
import { Header } from './components/Header/Header';
import { FontUploader } from './components/FontUploader/FontUploader';
import { FontComparison } from './components/FontComparison/FontComparison';
import { ConfigOutput } from './components/ConfigOutput/ConfigOutput';
import { fontStore } from './stores/fontStore';
import type { FallbackConfig } from './types/font';

export const App: Component = () => {
  const [fallbackConfig, setFallbackConfig] = createSignal<FallbackConfig>({
    familyName: '',
    localFallback: 'Arial',
    sizeAdjust: 100
  });

  createEffect(() => {
    const config = fontStore.getFallbackConfig();
    setFallbackConfig(config);
  });

  return (
    <div class="app">
      <Header />
      <main class="app__main">
        <div class="app__container">
          <div class="app__uploader">
            <FontUploader />
          </div>
          <div class="app__output">
            <ConfigOutput config={fallbackConfig()} />
          </div>
          <div class="app__comparison">
            <FontComparison />
          </div>
        </div>
      </main>
    </div>
  );
};