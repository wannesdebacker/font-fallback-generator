import { createSignal, type Component } from 'solid-js';
import type { FallbackConfig } from '../../types/font';
import './ConfigOutput.css';

interface ConfigOutputProps {
  config: FallbackConfig;
}

export const ConfigOutput: Component<ConfigOutputProps> = (props) => {
  const [copied, setCopied] = createSignal(false);

  const generateCSSConfig = () => {
    const { familyName, localFallback, sizeAdjust } = props.config;
    
    if (!familyName) {
      return '/* Upload a font to generate configuration */';
    }

    return `@font-face {
  font-family: '${familyName}';
  src: local('${localFallback}');
  font-display: swap;
  size-adjust: ${sizeAdjust}%;
}

/* Usage example */
.my-element {
  font-family: 'YourFontName', '${familyName}', ${localFallback}, sans-serif;
}`;
  };

  const copyToClipboard = async () => {
    const config = generateCSSConfig();
    
    try {
      await navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = config;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div class="config-output">
      <div class="config-output__header">
        <h2 class="config-output__title">Generated Configuration</h2>
        <button
          class={`config-output__copy-btn ${copied() ? 'config-output__copy-btn--copied' : ''}`}
          onClick={copyToClipboard}
          disabled={!props.config.familyName}
        >
          {copied() ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>

      <pre class="config-output__code">
        <code>{generateCSSConfig()}</code>
      </pre>
    </div>
  );
};