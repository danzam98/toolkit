# shadcn/ui Components

> **Last Updated**: March 2026

## Philosophy

shadcn/ui is **not a library** - it's a collection of copy-paste components you own. Organize for scale:

```
components/
├── ui/              # Raw shadcn components (don't modify)
├── primitives/      # Lightly customized components
└── blocks/          # Product-level compositions
```

## Installation

```bash
bunx shadcn@latest init
```

Choose:
- Style: **New York**
- Base color: **Slate**
- CSS variables: **Yes**

## Adding Components

```bash
bunx shadcn@latest add button card badge tabs accordion
bunx shadcn@latest add navigation-menu sheet command scroll-area
```

## Design Tokens

Define once, use everywhere:

```css
/* globals.css */
@theme {
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #4f46e5;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
}
```

## Performance Tips

```typescript
// Use CSS for hover states, not React state
// BAD
const [hovered, setHovered] = useState(false)
<div onMouseEnter={() => setHovered(true)} className={hovered ? 'bg-blue-500' : ''}>

// GOOD
<div className="hover:bg-blue-500">
```

## Accessibility

Radix UI (underlying primitives) provides accessibility by default. Don't break it:

- Keep semantic elements
- Preserve keyboard navigation
- Test with screen readers after modifications

## Latest (2026)

- **Base UI support**: Can now choose between Radix and Base UI as underlying primitives
- **Blocks marketplace**: Use shadcnspace.com for production-ready patterns

## References

- [shadcn/ui 2026 Guide](https://designrevision.com/blog/shadcn-ui-guide)
- [shadcn/ui Best Practices](https://medium.com/write-a-catalyst/shadcn-ui-best-practices-for-2026-444efd204f44)
