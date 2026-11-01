/** Koi's keyboard focus outline (the library's `focusRing` helper isn't exported yet). */
export const focusRing = {
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'focus-ring',
  outlineOffset: '2px',
} as const;

/** App-shell chrome, below Koi's overlay layers (dialog 900, popup 950, toast 1000). */
export const TOPBAR_HEIGHT = '56px';
export const SHELL_Z_INDEX = 40;
export const CONTENT_MAX_WIDTH = '1280px';
export const SIDEBAR_WIDTH = '288px';
