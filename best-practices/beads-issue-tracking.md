# Beads Issue Tracking (br)

> **Last Updated**: March 2026
>
> **Credit**: [Jeffrey Emanuel](https://github.com/Dicklesworthstone) — creator of beads_rust, beads_viewer, and the AI-first issue tracking workflow documented here.

## Overview

br (beads_rust) is a lightweight, git-friendly issue tracker that lives inside your repository. Think of it as "issues as code" — no external service required.

## Version Requirements

- br: 0.1.20+
- Rust 1.75+ (if building from source)

## Installation

```bash
# Via cargo (recommended)
cargo install beads_rust

# Via binary (Linux/macOS)
curl -fsSL https://raw.githubusercontent.com/Dicklesworthstone/beads_rust/main/install.sh | bash

# Verify installation
br --version
```

## Why br vs GitHub Issues

| Feature | GitHub Issues | br (beads) |
|---------|--------------|------------|
| Location | External servers | In-repo `.beads/` |
| Version control | Separate | Committed with code |
| Dependencies | Manual linking | Built-in graph |
| AI agent support | Limited | First-class (JSON output) |
| Offline access | No | Yes |

## Quick Start

```bash
br init                              # Initialize in project root
br create "Task title" -t task -p 2  # Create issue
br ready --json                      # Show unblocked work (JSON)
br update br-1 --status in_progress  # Claim task
br close br-1 --reason "Done"        # Complete
br sync --flush-only                 # Export to JSONL for git
```

## Command Reference

| Command | Description |
|---------|-------------|
| `br init` | Initialize beads in project |
| `br create` | Create new issue |
| `br list` | List all issues |
| `br update` | Modify issue properties |
| `br close` | Mark issue complete |
| `br reopen` | Reopen closed issue |
| `br sync` | Export to JSONL |
| `br ready` | Show unblocked work |
| `br stats` | View statistics |

## Issue Types

| Type | Use Case |
|------|----------|
| `bug` | Something broken |
| `feature` | New functionality |
| `task` | Work item (tests, docs, refactoring) |
| `epic` | Large feature with subtasks |
| `chore` | Maintenance (deps, tooling) |

## Priorities

| Level | Meaning |
|-------|---------|
| 0 | Critical (security, broken builds) |
| 1 | High (major features, important bugs) |
| 2 | Medium (default) |
| 3 | Low (polish, optimization) |
| 4 | Backlog (future ideas) |

## Dependencies

Link related issues with `--deps`:

```bash
# Discovered while working on br-5
br create "Found bug in X" -p 1 --deps discovered-from:br-5

# This task blocks another
br create "Setup database" -p 1
br update br-2 --deps blocks:br-3
```

`br ready` only shows issues with all dependencies resolved.

## .beads/ Directory Structure

After `br init`, your project contains:

```
.beads/
├── config.yaml      # Project settings (prefix, defaults)
├── beads.db         # SQLite database
├── issues.jsonl     # Exported issues for git
├── metadata.json    # Version info
└── .gitignore       # Ignores db-wal, backups
```

**CRITICAL**: Always commit `.beads/` with code changes. Run `br sync --flush-only` before committing.

## Filtering & Search

```bash
br list --type bug           # Filter by type
br list --priority 0         # Filter by priority
br list --status open        # Filter by status
br search "authentication"   # Text search
```

## Error Handling

| Error | Solution |
|-------|----------|
| `br: command not found` | Install via cargo or binary |
| `Not a beads project` | Run `br init` in project root |
| `Dependency cycle detected` | Review deps with `bv --robot-insights` |
| `Merge conflict in .beads/` | Prefer local changes, then `br sync` |

## Migration from Other Systems

### From GitHub Issues

Export issues via `gh issue list --json` and create beads manually.

### From Markdown TODOs

Convert inline `// TODO:` comments to beads, then remove comments.

## References

- [beads_rust repo](https://github.com/Dicklesworthstone/beads_rust)
- [beads_viewer repo](https://github.com/Dicklesworthstone/beads_viewer)
