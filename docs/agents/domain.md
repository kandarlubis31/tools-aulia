# Domain Docs Layout

**Layout type:** Single-context

## Files

| File | Purpose |
|------|---------|
| `CONTEXT.md` (repo root) | Project-wide domain language, architecture overview, and key conventions |
| `docs/adr/` | Architectural Decision Records — past decisions and their rationale |
| `ARCHITECTURE.md` | Detailed architecture documentation (already exists) |
| `AGENTS.md` | Agent skills configuration (this file points here) |

## Consumer rules

1. **Read `CONTEXT.md` first** when entering the project for the first time, or when a task involves cross-cutting concerns.
2. **Check `docs/adr/`** when making a decision that could have architectural impact — read existing ADRs before writing a new one.
3. **Do not edit `CONTEXT.md` or ADRs** without the user's explicit instruction — these are human-owned documents.
4. **Prefer updating existing files** over creating new context files to avoid fragmentation.

## Notes

- `ARCHITECTURE.md` at the repo root contains the most detailed architectural documentation.
- `CONTRIBUTING.md` has contributor workflow guides.
- `ROADMAP.md` tracks the project's medium/long-term direction.
