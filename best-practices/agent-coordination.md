# Agent Coordination

> **Last Updated**: March 2026

## Overview

When multiple AI agents work on a project, beads (br) provides the coordination layer. This guide covers multi-agent workflows.

## Single Agent Workflow

### Before Starting Work

```bash
# 1. Check available tasks
br ready --json

# 2. Claim your task
br update br-42 --status in_progress
```

### While Working

```bash
# If you discover new work, create linked issue
br create "Found bug in auth" -p 1 --deps discovered-from:br-42

# If blocked by something else
br create "Need API credentials" -p 0 -t task
br update br-42 --deps blocked-by:br-43
```

### After Completing

```bash
# 1. Close your bead with descriptive reason
br close br-42 --reason "Implemented OAuth2 flow with refresh tokens"

# 2. Sync to JSONL for git
br sync --flush-only

# 3. Commit code AND .beads/ together
git add . && git commit -m "feat: implement OAuth2 authentication"

# 4. Push to trigger CI
git push
```

## Multi-Agent Parallel Work

### Identifying Parallelizable Tasks

```bash
# Get execution plan with parallel tracks
bv --robot-plan
```

Output shows independent task chains:

```json
{
  "tracks": [
    {"name": "auth", "beads": ["br-1", "br-3", "br-5"]},
    {"name": "ui", "beads": ["br-2", "br-4"]}
  ]
}
```

### Claiming Tasks

Each agent should:
1. Run `br ready --json` to see available work
2. Claim ONE task: `br update <id> --status in_progress`
3. Complete before claiming another

**Conflict avoidance**: If two agents claim the same task, the second will see `status: in_progress` and should pick another.

## Communication Patterns

### Descriptive Bead Reasons

Good:
```bash
br close br-5 --reason "Added user authentication with JWT, bcrypt password hashing, and 24h token expiry"
```

Bad:
```bash
br close br-5 --reason "Done"
```

### Linking Related Work

```bash
# When one task reveals another
br create "Refactor user model" --deps discovered-from:br-5

# When tasks have dependencies
br update br-7 --deps blocked-by:br-6
```

### Using Agent Mail (Optional)

If MCP Agent Mail is configured:
1. Check inbox before starting work
2. Acknowledge messages after reading
3. Reply to questions from other agents
4. Send messages when blocked or handing off

## Handling Code TODOs

Inline `// TODO:` comments should be converted to beads:

```typescript
// Instead of this:
// TODO: Add rate limiting

// Do this:
br create "Add rate limiting to API endpoints" -t task -p 2
```

Then remove the TODO comment after creating the bead.

## Merge Conflicts in .beads/

If git reports conflicts in `.beads/`:

```bash
# Accept local changes (your work)
git checkout --ours .beads/

# Re-sync to regenerate JSONL
br sync --flush-only

# Commit the resolution
git add .beads/ && git commit -m "chore: resolve beads merge conflict"
```

## Verification Before Commit

```bash
# Check all your beads are closed or synced
br list --status in_progress

# Should return empty if all work is complete
# If not empty, close them or update status

br sync --flush-only
git status  # Verify .beads/ changes are staged
```

## References

- [beads-issue-tracking.md](./beads-issue-tracking.md)
- [beads-viewer.md](./beads-viewer.md)
