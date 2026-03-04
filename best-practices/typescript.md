# TypeScript Configuration

> **Last Updated**: March 2026

## Strict Mode (Required)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,

    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noEmit": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    "plugins": [
      { "name": "next" }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Key Patterns

### Explicit Return Types

```typescript
// Prefer explicit return types for public APIs
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
```

### Satisfies Operator

```typescript
// Use satisfies for inline type checking
const config = {
  name: 'My Project',
  url: 'https://example.com',
} satisfies SiteConfig
```

### Const Assertions

```typescript
// Use const assertions for literal types
const CATEGORIES = ['ai', 'tools', 'guides'] as const
type Category = typeof CATEGORIES[number]
```

### Discriminated Unions

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    // TypeScript knows result.data exists
    console.log(result.data)
  } else {
    // TypeScript knows result.error exists
    console.error(result.error)
  }
}
```

### Utility Types

```typescript
// Common utility types
type PartialConfig = Partial<Config>           // All optional
type RequiredConfig = Required<Config>         // All required
type ReadonlyConfig = Readonly<Config>         // Immutable
type PickedConfig = Pick<Config, 'name'>       // Subset
type OmittedConfig = Omit<Config, 'internal'>  // Exclude
```

## References

- [TypeScript Strict Mode Guide](https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/)
- [TypeScript Best Practices 2026](https://www.bacancytechnology.com/blog/typescript-best-practices)
