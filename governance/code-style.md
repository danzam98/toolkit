# Code Style Guide

## Formatting

### General

- **Indent**: 2 spaces (no tabs)
- **Line length**: 100 characters max
- **Trailing commas**: ES5 style (`es5`)
- **Semicolons**: None (no semicolons)
- **Quotes**: Single quotes for strings

### Configuration

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `HeroSection.tsx` |
| Utilities | camelCase | `utils.ts`, `formatDate.ts` |
| Constants | camelCase | `constants.ts` |
| Types | camelCase | `types.ts` |
| Pages | kebab-case | `about/page.tsx` |

### Code

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `function Button()` |
| Functions | camelCase | `function formatDate()` |
| Variables | camelCase | `const userName` |
| Constants | SCREAMING_SNAKE_CASE | `const API_URL` |
| Types/Interfaces | PascalCase | `interface UserProps` |
| CSS classes | kebab-case | `class="hero-section"` |

## TypeScript

### Prefer Explicit Types

```typescript
// Good: explicit return type
function formatDate(date: Date): string {
  return date.toISOString()
}

// Avoid: inferred return type for public APIs
function formatDate(date: Date) {
  return date.toISOString()
}
```

### Use `satisfies` for Type Checking

```typescript
// Good: preserves literal types
const config = {
  name: 'My App',
  version: '1.0.0',
} satisfies Config

// Avoid: loses literal types
const config: Config = {
  name: 'My App',
  version: '1.0.0',
}
```

### Prefer `type` over `interface`

```typescript
// Prefer
type ButtonProps = {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
}

// Use interface only for declaration merging
interface Window {
  turnstile: TurnstileAPI
}
```

## React

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react'
import { cn } from '@/lib/utils'

// 2. Types
type ButtonProps = {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

// 3. Component
export function Button({ variant = 'primary', children }: ButtonProps) {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false)

  // 5. Handlers
  const handleClick = () => {
    setIsLoading(true)
  }

  // 6. Render
  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-md px-4 py-2',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'bg-secondary text-white'
      )}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
```

### Props Destructuring

```typescript
// Good: destructure in signature
export function Button({ variant, children }: ButtonProps) {
  return <button>{children}</button>
}

// Avoid: destructure in body
export function Button(props: ButtonProps) {
  const { variant, children } = props
  return <button>{children}</button>
}
```

## Tailwind CSS

### Class Order

Use Prettier plugin for automatic sorting. Manual order:

1. Layout (display, position)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Misc (cursor, transition)
6. States (hover, focus)
7. Responsive

### Use `cn()` for Conditional Classes

```typescript
import { cn } from '@/lib/utils'

<div
  className={cn(
    'base-classes',
    condition && 'conditional-classes',
    variant === 'primary' && 'variant-classes'
  )}
/>
```

## Imports

### Order

1. External packages
2. Internal aliases (`@/`)
3. Relative imports
4. Types (last)

```typescript
import { useState } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { formatDate } from './utils'

import type { ButtonProps } from './types'
```
