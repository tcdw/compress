import { defineConfig } from '@pandacss/dev';

// Koi ships its tokens, recipes and global styles as a published design system, so this config only
// adds the app's own source. Do not add presets, staticCss or node_modules to `include`.
export default defineConfig({
  preflight: true,
  designSystem: '@tuuject/koi-react',
  include: ['./src/**/*.{ts,tsx}'],
  // Koi's only breakpoint: phone below, side-by-side above. It lives in config, not in the tokens.
  theme: { extend: { breakpoints: { md: '768px' } } },
});
