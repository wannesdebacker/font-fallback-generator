export const SAMPLE_TEXT = `
<h1>The Art of Typography</h1>
<h2>Essential Principles of Digital Type Design</h2>
<h3>Understanding Font Metrics and Visual Hierarchy</h3>
<h4>Critical Typography Measurements</h4>
<h5>Smaller Heading Level</h5>
<h6>Smallest Heading Level</h6>

<p><strong>Typography is the foundation of all visual communication.</strong> The careful selection and implementation of typefaces determines how effectively information is transmitted to readers. Every font carries its own personality, rhythm, and visual weight that influences the reader's experience and comprehension.</p>

<p>Font fallbacks serve a critical role in maintaining design consistency across different platforms and devices. When a primary font fails to load, the fallback system ensures that text remains readable while preserving the intended visual hierarchy and spacing. This is particularly important for web typography where loading times and font availability can vary significantly.</p>

<p><em>The quick brown fox jumps over the lazy dog.</em> This pangram contains every letter of the English alphabet and serves as an excellent test for font rendering. ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890 !@#$%^&*()_+-=[]{}|;:'",./<>?</p>

<ul>
  <li><strong>Ascender Height:</strong> The distance from baseline to the top of characters like 'b', 'd', 'f', 'h', 'k', 'l', 't' - these letterforms extend above the x-height and significantly impact line spacing calculations</li>
  <li><strong>Descender Depth:</strong> Characters such as 'g', 'j', 'p', 'q', 'y' extend below the baseline and affect overall text block height measurements</li>
  <li><strong>X-Height Proportion:</strong> The height of lowercase letters like 'a', 'c', 'e', 'm', 'n', 'o', 'r', 's', 'u', 'v', 'w', 'x', 'z' relative to cap height determines readability at smaller sizes</li>
  <li><strong>Cap Height Consistency:</strong> All capital letters 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' should align perfectly to maintain visual uniformity across text blocks</li>
</ul>

<ol>
  <li>First ordered item with <code>inline code</code> and regular text mixed together</li>
  <li>Second item testing <a href="#1">link styling</a> within content blocks</li>
  <li>Third item with <mark>highlighted text</mark> for emphasis and attention</li>
  <li>Fourth item with <s>strikethrough</s> and <u>underlined</u> text variations</li>
  <li>Fifth item with <small>small text</small> and normal size comparisons</li>
</ol>

<blockquote>
"Typography is the craft of endowing human language with a durable visual form, and thus with an independent existence." — Robert Bringhurst, The Elements of Typographic Style. This fundamental principle guides all typographic decisions, from the selection of appropriate fallback fonts to the fine-tuning of size adjustments that ensure consistent visual rhythm across different typeface implementations.
</blockquote>

<p><strong>Numerals and Mathematical Symbols:</strong> 0123456789 ½¼¾⅓⅔⅛⅜⅝⅞ ±×÷=≠≤≥≈∞ €$£¥¢</p>

<p><strong>Punctuation and Special Characters:</strong> .,;:!?'"()[]{}—–-•…‚„"''"" «»‹› §¶©®™°′″‰@ #%&*+=<>|~^\`¡¿¦¨¯´¸˙˚˜˝</p>

<p><strong>International Characters:</strong> ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ</p>

<p><strong>ALL CAPITALS TEST:</strong> THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG WHILE MAINTAINING PROPER LETTER SPACING AND READABILITY ACROSS EXTENDED TEXT PASSAGES</p>

<p><strong>all lowercase examination:</strong> the quick brown fox jumps over the lazy dog ensuring comfortable reading flow and natural character rhythm throughout extended paragraphs</p>

<p><strong>Mixed Case Balance:</strong> The Quick Brown Fox Jumps Over The Lazy Dog Creating Natural Reading Patterns With Proper Visual Weight Distribution</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<p>This comprehensive text sample provides extensive coverage of typical web content scenarios, ensuring that font fallback calculations account for real-world usage patterns rather than simplified test cases. The varied font sizes, weights, and styling options demonstrate how different typographic treatments affect overall layout consistency when switching between primary fonts and their fallback alternatives.</p>
`;

export const SYSTEM_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'system-ui',
  'serif',
  'sans-serif',
  'monospace'
] as const;

export type SystemFont = typeof SYSTEM_FONTS[number];