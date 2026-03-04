# AGENTS.md — AI Agent Rules

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

## Code Editing Discipline

**NEVER** run a script that processes/changes code files in this repo. No "code mods" you just invented, no giant regex-based `sed` one-liners, no auto-refactor scripts that touch large parts of the tree.

* If many changes are needed but they're **mechanical**, use several subagents in parallel to make the edits, but still apply them **manually** and review diffs.
* If changes are **subtle or complex**, you must methodically do them yourself, carefully, file by file.

---

## Backwards Compatibility & File Sprawl

We do **not** care about backwards compatibility — we want the cleanest possible architecture with **zero tech debt**:

* Do **not** create "compatibility shims".
* Do **not** keep old APIs around just in case. Migrate callers and delete the old API (subject to the no-deletion rule for files; code removal inside a file is fine).

**AVOID** uncontrolled proliferation of code files:

* If you want to change something or add a feature, you MUST revise the **existing** code file in place.
* You may NEVER create files like `componentV2.tsx`, `componentImproved.tsx`, `componentNew.tsx`, etc.
* New code files are reserved for **genuinely new domains** that make no sense to fold into any existing module.
* The bar for adding a new file should be **incredibly high**.

---

## Static Analysis & Type Safety

**CRITICAL:** After any substantive changes to TypeScript/React code, verify no lint or type errors:

```bash
# Type-check (no emit)
bun run typecheck  # or: npx tsc --noEmit

# Lint
bun run lint
```

If there are errors:
* Read enough context around each one to understand the *real* problem.
* Fix issues at the root cause rather than just silencing rules.
* Re-run until clean.

---

## Git Workflow

1. Make changes
2. Run `bun run typecheck` and `bun run lint`
3. Commit with descriptive message
4. Push to trigger CI

### Commit Messages

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Keep subject line under 72 characters
- Include context in body if needed

---

## Issue Tracking with br (beads_rust)

**IMPORTANT**: Use br for ALL issue tracking. Do NOT use markdown TODOs, GitHub Issues, or other external trackers for task coordination.

**CRITICAL**: Only interact with beads via the `br` command. NEVER directly edit `.beads/*.json` or `.beads/*.jsonl` files.

**CRITICAL**: Always commit `.beads/` directory with code changes. Issue state must stay synchronized with code state.

### Quick Reference

```bash
br ready --json                      # Show unblocked tasks (JSON)
br create "Title" -t task -p 2       # Create issue
br update br-1 --status in_progress  # Claim task
br close br-1 --reason "Done"        # Complete task
br sync --flush-only                 # Export for git
bv --robot-priority                  # What should I work on?
```

### Workflow

1. `br ready --json` — Find available work
2. `br update <id> --status in_progress` — Claim it
3. Work on the task
4. `br close <id> --reason "..."` — Complete with descriptive reason
5. `br sync --flush-only` — Prepare for commit
6. Commit code + `.beads/` together

### Full Documentation

- [beads-issue-tracking.md](../best-practices/beads-issue-tracking.md) — Commands, types, priorities
- [beads-viewer.md](../best-practices/beads-viewer.md) — Robot flags for AI agents
- [agent-coordination.md](../best-practices/agent-coordination.md) — Multi-agent workflows

---

## Performance Considerations

### Core Web Vitals Targets
- LCP ≤ 2.0s (p75)
- INP ≤ 200ms (p75)
- CLS ≤ 0.1
- JS shipped: < 180KB gzip on homepage

### Image Optimization
- Use WebP/AVIF with srcset
- Lazy-load below fold
- Above-the-fold images ≤ 150KB (mobile)
- All images get hashed filenames for immutable caching

### Bundle Size
- Lazy-load heavy components (embeds, calculators)
- No third-party embeds above the fold
- Monitor with bundle budget checks in CI

---

## Accessibility

- WCAG 2.2 AA baseline
- All interactive elements need visible focus states
- Skip link at top of page for keyboard navigation
- Images need meaningful alt text (or `alt=""` for decorative)
- Respect `prefers-reduced-motion` for all animations
- Maintain proper heading hierarchy (h1 > h2 > h3)

---

## Environment Variables

Never commit secrets. Use `.env.local` (gitignored):

```bash
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Email services
BUTTONDOWN_API_KEY=...
RESEND_API_KEY=...

# GitHub (build-time enrichment)
GITHUB_TOKEN=...
```

---

## Reference

- Best practices: `../best-practices/`
- Code style: `./code-style.md`
- Review checklist: `./review-checklist.md`
