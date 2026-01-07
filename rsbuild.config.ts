import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

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
  },
});
