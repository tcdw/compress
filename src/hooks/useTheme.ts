import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

declare global {
  interface Window {
    /** Set by @tuuject/koi-tokens/theme-init.js, inlined in <head> by rsbuild.config.ts. */
    koiSetTheme?: (theme: Theme | null) => void;
  }
}

const root = document.documentElement;
const readTheme = (): Theme =>
  root.dataset.theme === 'dark' ? 'dark' : 'light';

// Watch the attribute itself, so every writer is seen: koiSetTheme, and theme-init following an OS flip.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/**
 * Light / dark state for the shell. The source of truth is theme-init.js (localStorage "koi-theme" or
 * the OS setting, applied as <html data-theme>); this hook only reads it for icons and labels.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme);
  const toggle = () =>
    window.koiSetTheme?.(theme === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}
