# GitHub Workflow for AI Agents

> **Last Updated**: March 2026

## Overview

This guide covers GitHub best practices for AI agents working on repositories. The core principle: **your work isn't done until it's pushed**.

## The Golden Rule

**Always push after committing.**

Unpushed commits are:
- Invisible to the user and other agents
- Not backed up to GitHub
- Not triggering CI/CD
- At risk of being lost

```bash
# After EVERY commit
git push origin <branch>
```

## Starting a Session

Before making any changes:

```bash
# 1. Check current state
git status
git branch -v

# 2. Fetch latest from remote
git fetch origin

# 3. Pull changes (rebase to keep history clean)
git pull --rebase origin main

# 4. Check for any CI failures on current branch
gh run list --limit 3
```

If `git status` shows uncommitted changes from a previous session, investigate before proceeding.

## Standard Commit-Push Cycle

```bash
# 1. Stage changes
git add <specific-files>        # Prefer specific files over -A

# 2. Review what you're committing
git diff --staged

# 3. Commit with conventional message
git commit -m "feat: add user authentication"

# 4. Push immediately
git push origin main

# 5. Verify CI triggered
gh run list --limit 1
```

## Conventional Commits

| Prefix | Use Case |
|--------|----------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code change that neither fixes nor adds |
| `test:` | Adding or updating tests |
| `chore:` | Tooling, deps, config |
| `perf:` | Performance improvement |

Examples:
```
feat: add OAuth2 login flow
fix: resolve race condition in user service
docs: update API endpoint documentation
refactor: extract validation logic to separate module
```

## GitHub CLI (gh) Reference

### Pull Requests

```bash
# Create PR from current branch
gh pr create --title "feat: new feature" --body "Description here"

# Create PR with draft status
gh pr create --draft --title "WIP: feature"

# List open PRs
gh pr list

# View PR details
gh pr view 123

# Check out a PR locally
gh pr checkout 123

# Merge PR (after approval)
gh pr merge 123 --squash --delete-branch
```

### CI/CD Workflow Runs

```bash
# List recent runs
gh run list --limit 5

# View specific run
gh run view <run-id>

# Watch run in real-time
gh run watch

# View run logs
gh run view <run-id> --log

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### Issues

```bash
# List issues
gh issue list

# Create issue
gh issue create --title "Bug: something broken" --body "Details"

# View issue
gh issue view 42

# Close issue
gh issue close 42 --reason completed
```

### Repository Info

```bash
# View repo details
gh repo view

# Clone a repo
gh repo clone owner/repo

# Fork a repo
gh repo fork owner/repo
```

## Branch Strategy

### Solo Projects (Direct Push)

For personal repos without collaborators:
- Push directly to `main`
- No PR required for small changes
- Still run CI checks

### Team Projects (PR Flow)

```bash
# Create feature branch
git checkout -b feat/my-feature

# Make changes and commit
git add .
git commit -m "feat: implement feature"

# Push branch
git push -u origin feat/my-feature

# Create PR
gh pr create --fill

# After review, merge
gh pr merge --squash --delete-branch
```

## Handling CI Failures

When CI fails after pushing:

```bash
# 1. Check what failed
gh run view --log-failed

# 2. Fix the issue locally
# ... make fixes ...

# 3. Commit the fix
git add .
git commit -m "fix: resolve CI failure in tests"

# 4. Push again
git push origin main

# 5. Verify CI passes
gh run watch
```

**Never leave a broken build.** If you caused CI to fail, fix it before moving on.

## Merge Conflicts

When `git pull` reports conflicts:

```bash
# 1. See which files conflict
git status

# 2. Open each conflicted file and resolve
# Look for <<<<<<< HEAD markers

# 3. After resolving, stage the files
git add <resolved-files>

# 4. Complete the merge/rebase
git rebase --continue  # if rebasing
git commit             # if merging

# 5. Push
git push origin main
```

## What Not To Do

| Don't | Why | Do Instead |
|-------|-----|------------|
| `git push --force` on main | Destroys shared history | Create a revert commit |
| `git add -A` blindly | May include secrets/.env | Stage specific files |
| Commit without pushing | Work is not backed up | Always push after commit |
| Ignore CI failures | Broken builds block others | Fix immediately |
| Commit large binaries | Bloats repo forever | Use Git LFS or external storage |
| Commit node_modules | Huge, unnecessary | Already in .gitignore |

## End of Session Checklist

Before ending any coding session:

- [ ] All changes committed (`git status` shows clean)
- [ ] All commits pushed (`git log origin/main..HEAD` shows nothing)
- [ ] CI is passing (`gh run list --limit 1`)
- [ ] No WIP code left uncommitted

## References

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
