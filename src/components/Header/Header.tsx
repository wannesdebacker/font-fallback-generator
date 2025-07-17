import type { Component } from 'solid-js';
import './Header.css';

export const Header: Component = () => {
  return (
    <header class="header">
      <div class="header__container">
        <h1 class="header__title">Font Fallback Generator</h1>
        <p class="header__subtitle">
          Upload a font file and generate optimized fallback configurations for perfect web typography
        </p>
        <p class="header__privacy">
          Fully client-side — your fonts never leave your device and nothing is tracked
        </p>
      </div>
    </header>
  );
};