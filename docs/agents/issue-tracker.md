# Issue Tracker

**Type:** Local markdown

## Location

Issues live as markdown files under `.scratch/<feature>/` at the repo root.

## Conventions

- Each issue is a single `.md` file in a subdirectory named after the feature or area (e.g., `.scratch/pdf-tools/optimize-compression.md`).
- The filename should be a short kebab-case slug describing the issue.
- The first line of the file is the title (H1 heading).
- Labels/tags can be listed in a YAML frontmatter block.

## Workflow

1. Create `.scratch/<feature>/<short-description>.md`
2. Work through the issue
3. When resolved, move the file to `.scratch/archived/` or delete it

## Why local?

This project is a solo / small-team effort. Local markdown issues are lightweight, work fully offline, and don't require a GitHub/GitLab login or CLI tooling.
