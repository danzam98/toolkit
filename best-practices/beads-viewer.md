# Beads Viewer (bv)

> **Last Updated**: March 2026

## Overview

bv is a fast terminal UI for Beads projects. For AI agents, it provides dependency-aware insights via robot flags.

## Version Requirements

- bv: 0.2.0+
- Requires br to be initialized in project

## Installation

```bash
# Via cargo
cargo install beads_viewer

# Via install script
curl -fsSL https://raw.githubusercontent.com/Dicklesworthstone/beads_viewer/main/install.sh | bash

# Verify
bv --version
```

## CRITICAL: Robot Flags for AI Agents

**NEVER run bare `bv`** — it launches an interactive TUI that blocks the terminal.

**ALWAYS use `--robot-*` flags for programmatic access:**

```bash
bv --robot-help          # Shows all AI-facing commands
bv --robot-insights      # JSON graph metrics
bv --robot-plan          # JSON execution plan
bv --robot-priority      # JSON priority recommendations
bv --robot-recipes       # List actionable/blocked beads
```

## Command Reference

| Flag | Output | Use Case |
|------|--------|----------|
| `--robot-help` | Help text | Discover available flags |
| `--robot-insights` | JSON | Graph metrics, PageRank, critical path, cycles |
| `--robot-plan` | JSON | Execution plan with parallel tracks |
| `--robot-priority` | JSON | Priority recommendations with reasoning |
| `--robot-recipes` | JSON | Categorized lists (actionable, blocked, etc.) |

## Output Examples

### --robot-insights

```json
{
  "total_beads": 15,
  "open_count": 8,
  "blocked_count": 3,
  "ready_count": 5,
  "critical_path": ["br-1", "br-3", "br-7"],
  "has_cycles": false
}
```

### --robot-priority

```json
{
  "recommendations": [
    {
      "id": "br-5",
      "score": 0.85,
      "reason": "High priority, unblocks 3 other tasks"
    }
  ]
}
```

## When to Use Each Flag

| Question | Flag |
|----------|------|
| "What should I work on next?" | `--robot-priority` |
| "How can agents parallelize?" | `--robot-plan` |
| "What's the dependency graph?" | `--robot-insights` |
| "What's blocked vs ready?" | `--robot-recipes` |

## Error Handling

| Error | Solution |
|-------|----------|
| `bv: command not found` | Install via cargo or script |
| `Not a beads project` | Run `br init` first |
| `Empty output` | No beads exist; create with `br create` |

## References

- [beads_viewer repo](https://github.com/Dicklesworthstone/beads_viewer)
