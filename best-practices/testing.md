# Testing

> **Last Updated**: March 2026

## Unit Tests (Vitest)

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

### Example Tests

```typescript
// __tests__/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('formats ISO date', () => {
    expect(formatDate(new Date('2026-03-04'))).toBe('March 4, 2026')
  })
})
```

### Component Testing

```typescript
// __tests__/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

## E2E Tests (Playwright)

### Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Example Tests

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test('navigates to about page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=About')
  await expect(page).toHaveURL('/about/')
})

test('contact form submits successfully', async ({ page }) => {
  await page.goto('/contact')
  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('textarea[name="message"]', 'Hello!')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/thanks/contact/')
})
```

## Run Tests

```bash
bun run test           # Unit tests
bun run test:e2e       # E2E tests
bun run test:coverage  # Coverage report
```

## References

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
