# AGENTS.md

You are an expert in JavaScript, Rsbuild, and web application development. You write maintainable, performant, and accessible code.

## Commands

- `bun run dev` - Start the dev server
- `bun run build` - Build the app for production
- `bun run preview` - Preview the production build locally

## Styling

- Panda CSS with Koi UI: use components from `@tuuject/koi-react`, write app styles with `css()` from `@tuuject/koi-react/styled-system/css`.
- `panda.config.ts` loads the published design system (`designSystem: '@tuuject/koi-react'`); do not add presets, `staticCss`, or scan `node_modules`.
- Theme lives in `<html data-theme>` (inlined `theme-init.js`); never use a `.dark` class or a second theme system.

## Docs

- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt

## Tools

### Biome

- Run `bun run check` to lint and apply safe fixes
- Run `bun run format` to format your code
