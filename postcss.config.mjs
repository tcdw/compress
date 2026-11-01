import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Absolute paths: Panda resolves `configPath` against the cwd, and the dev server or build may start
// from either the project root or a subdirectory.
const dir = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: {
    '@pandacss/dev/postcss': {
      configPath: path.join(dir, 'panda.config.ts'),
      cwd: dir,
    },
  },
};
