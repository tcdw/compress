import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const require = createRequire(import.meta.url);

// Koi's theme bootstrap: sets <html data-theme="light|dark"> from the OS before first paint. Inlined ahead
// of the stylesheet so a dark-mode reader never sees a light flash.
const themeInit = readFileSync(
  require.resolve('@tuuject/koi-tokens/theme-init.js'),
  'utf8',
);

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      'process.env.BUILD_YEAR': JSON.stringify(new Date().getFullYear()),
    },
  },
  html: {
    template: './index.html',
    tags: [{ tag: 'script', children: themeInit, head: true, append: false }],
  },
});
