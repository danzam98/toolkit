# Pre-Commit Review Checklist

Use this checklist before committing changes.

## Type Safety

- [ ] `bun run typecheck` passes with no errors
- [ ] No `any` types added (use `unknown` if needed)
- [ ] Explicit return types on public functions
- [ ] No type assertions (`as`) without justification

## Linting

- [ ] `bun run lint` passes with no errors
- [ ] No disabled ESLint rules without comment
- [ ] No `eslint-disable` without justification

## Tests

- [ ] `bun run test` passes
- [ ] New code has test coverage
- [ ] E2E tests pass for affected flows

## Accessibility

- [ ] Interactive elements have focus states
- [ ] Images have alt text
- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] Color contrast meets WCAG AA
- [ ] `prefers-reduced-motion` respected

## Performance

- [ ] No large dependencies added
- [ ] Heavy components are lazy-loaded
- [ ] Images optimized (AVIF/WebP)
- [ ] No third-party scripts above the fold

## Security

- [ ] No secrets in code
- [ ] User input validated/sanitized
- [ ] API endpoints rate-limited
- [ ] CSP headers maintained

## Code Quality

- [ ] No duplicate code
- [ ] No dead code
- [ ] Clear variable/function names
- [ ] Comments explain "why" not "what"

## Documentation

- [ ] Public APIs documented
- [ ] Complex logic has comments
- [ ] README updated if needed

## Git

- [ ] Commit message follows convention
- [ ] Changes are atomic (one concern per commit)
- [ ] No unrelated changes included
- [ ] Branch up to date with main

## Issue Tracking

- [ ] `br sync --flush-only` run before commit
- [ ] `.beads/` directory changes are staged
- [ ] Related beads updated or closed
- [ ] New discoveries linked with `discovered-from`
- [ ] Descriptive close reasons (not just "Done")

---

## Quick Commands

```bash
# Run all checks
bun run typecheck && bun run lint && bun run test

# Format code
bun run format

# Build and verify
bun run build
```
