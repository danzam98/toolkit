# AGENTS.md — {{BRAND_NAME}}

## RULE NUMBER 1 (NEVER EVER EVER FORGET THIS RULE!!!)

**YOU ARE NEVER ALLOWED TO DELETE A FILE WITHOUT EXPRESS PERMISSION FROM ME OR A DIRECT COMMAND FROM ME.**

Even a new file that you yourself created, such as a test code file. You have a horrible track record of deleting critically important files or otherwise throwing away tons of expensive work that I then need to pay to reproduce.

As a result, you have permanently lost any and all rights to determine that a file or folder should be deleted. You must **ALWAYS** ask and *receive* clear, written permission from me before ever even thinking of deleting a file or folder of any kind!

---

## IRREVERSIBLE GIT & FILESYSTEM ACTIONS — DO-NOT-EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states, in the same message, that they understand and want the irreversible consequences.

2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask the user for specific approval. "I think it's safe" is never acceptable.

3. **Safer alternatives first:** When cleanup or rollbacks are needed, request permission to use non-destructive options (`git status`, `git diff`, `git stash`, copying to backups) before ever considering a destructive command.

4. **Mandatory explicit plan:** Even after explicit user authorization, restate the command verbatim, list exactly what will be affected, and wait for a confirmation that your understanding is correct. Only then may you execute it—if anything remains ambiguous, refuse and escalate.

5. **Document the confirmation:** When running any approved destructive command, record (in the session notes / final response) the exact user text that authorized it, the command actually run, and the execution time. If that record is absent, the operation did not happen.

---

## Project Overview

**Brand:** {{BRAND_NAME}}
**Domain:** {{DOMAIN}}
**Description:** {{DESCRIPTION}}

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), static export |
| UI | React 19, TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Animation | Motion (`motion/react`) |
| Typography | Geist (sans + mono) |
| Icons | Lucide React |
| Deployment | Cloudflare Pages |

---

## Package Manager — Bun

```bash
bun install          # Install dependencies
bun dev              # Development server
bun run build        # Production build
bun run lint         # ESLint
bun run typecheck    # TypeScript check
bun run test         # Unit tests
bun run test:e2e     # E2E tests
```

---

## Code Editing Discipline

**NEVER** run scripts that process/change code files in bulk. No "code mods," no giant regex-based `sed` one-liners, no auto-refactor scripts.

* Mechanical changes: use subagents in parallel, apply manually, review diffs
* Complex changes: do them yourself, file by file

---

## Backwards Compatibility & File Sprawl

We want the **cleanest architecture with zero tech debt**:

* No compatibility shims
* No old APIs kept "just in case" — migrate callers and delete (code removal in files is fine)

**Avoid file proliferation:**

* Revise existing files, don't create `V2`, `New`, `Improved` variants
* New files only for genuinely new domains
* The bar for adding files should be **incredibly high**

---

## Static Analysis & Type Safety

**After any code changes:**

```bash
bun run typecheck    # Must pass
bun run lint         # Must pass
```

Fix at root cause, don't silence rules.

---

## Issue Tracking with br (beads_rust)

**IMPORTANT**: Use br for ALL issue tracking. Do NOT use markdown TODOs or external trackers.

**CRITICAL**: Only interact via `br` command. NEVER edit `.beads/*.json` files directly.

**CRITICAL**: Always commit `.beads/` with code changes.

### Quick Reference

```bash
br ready --json                      # Show unblocked tasks
br create "Title" -t task -p 2       # Create issue
br update br-1 --status in_progress  # Claim task
br close br-1 --reason "Done"        # Complete
br sync --flush-only                 # Export for git
bv --robot-priority                  # What to work on?
```

### Workflow

1. `br ready --json` — Find work
2. `br update <id> --status in_progress` — Claim it
3. Work on the task
4. `br close <id> --reason "..."` — Complete
5. `br sync --flush-only` — Prepare for git
6. Commit code + `.beads/` together

---

## Git Workflow

1. Make changes
2. Run `bun run typecheck` and `bun run lint`
3. Update beads: `br close <id>` for completed work
4. Run `br sync --flush-only`
5. Commit code AND `.beads/` together
6. Push to trigger CI

### Commit Messages

Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

---

## Performance Targets

- LCP ≤ 2.0s (p75)
- INP ≤ 200ms (p75)
- CLS ≤ 0.1
- JS: < 180KB gzip on homepage

---

## Accessibility

- WCAG 2.2 AA baseline
- Visible focus states
- Skip link on all pages
- Meaningful alt text
- Respect `prefers-reduced-motion`
- Proper heading hierarchy

---

## Reference

Best practices and full documentation:
- https://github.com/danzam98/toolkit/tree/main/best-practices
- https://github.com/danzam98/toolkit/blob/main/governance/AGENTS.md
