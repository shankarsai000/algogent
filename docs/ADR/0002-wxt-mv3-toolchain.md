# ADR 0002: WXT for MV3 extension builds

## Status

Accepted

## Context

Phase 0 used a static copy script that could not produce a loadable TypeScript extension. We need a maintained MV3 toolchain with side panel + content script entrypoints.

## Decision

Use **WXT** (`wxt`) for `@algogent/extension`:

- `src/entrypoints/background.ts`
- `src/entrypoints/sidepanel/`
- `src/entrypoints/chatgpt.content.ts`

Shared domain logic stays in `@algogent/shared`.

## Consequences

- `pnpm --filter @algogent/extension dev` yields a Chrome-loadable output
- Slight framework coupling; acceptable vs hand-rolled Vite MV3 config
