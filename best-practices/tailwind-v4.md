# Tailwind CSS v4

> **Last Updated**: March 2026

## CSS-First Configuration

Tailwind v4 replaces `tailwind.config.js` with CSS `@theme` directives:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #94a3b8;
  --color-primary: #4f46e5;
  --color-secondary: #0891b2;
  --color-accent: #f59e0b;

  /* Typography */
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;

  /* Spacing (extends defaults) */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;

  /* Border radius */
  --radius-lg: 0.75rem;
  --radius-md: 0.5rem;
  --radius-sm: 0.25rem;

  /* Shadows */
  --shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Dark mode (if needed) */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0f172a;
    --color-foreground: #f8fafc;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Key Changes from v3

| v3 | v4 |
|----|-----|
| `tailwind.config.js` | `@theme` in CSS |
| `content` array | Auto-detection |
| `darkMode: 'class'` | `darkMode: 'selector'` (explicit) |
| `@apply` recommended | Move away from `@apply` |
| JavaScript plugins | CSS-native where possible |

## Migration

```bash
# Run official upgrade tool
npx @tailwindcss/upgrade
```

## Performance

- Full builds: **5x faster** (under 100ms)
- Incremental builds: **100x faster** (single-digit ms)
- Uses Lightning CSS under the hood

## References

- [Tailwind CSS v4 Complete Guide](https://devtoolbox.dedyn.io/blog/tailwind-css-v4-complete-guide)
- [Tailwind CSS v4 Migration](https://www.digitalapplied.com/blog/tailwind-css-v4-2026-migration-best-practices)
- [Tailwind v4 Tips](https://www.nikolailehbr.ink/blog/tailwindcss-v4-tips/)
