# ADR 0001: Monorepo + TypeScript extension stack

## Status

Accepted

## Context

Algogent needs a browser extension, shared domain types, and eventually payment logic. We need one repo, strict typing, and a modern MV3 toolchain.

## Decision

- **pnpm workspaces** monorepo: `packages/shared`, `packages/extension`
- **TypeScript** strict across packages
- **Vitest** for unit tests
- Extension structure compatible with **WXT** / Vite-based MV3 builds (scaffold first; full WXT integration in Phase 1)
- **Zod** for runtime validation of skills and messages

## Consequences

- Shared types prevent drift between UI and adapters
- CI can typecheck and test without a browser
- Extension packaging remains a deliberate Phase 1 task
