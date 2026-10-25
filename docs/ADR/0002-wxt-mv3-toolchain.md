# ADR 0002: WXT for MV3 extension builds

## Status
Accepted

## Decision
Use WXT for `@algogent/extension` entrypoints (background, sidepanel, content scripts).

## Consequences
`pnpm --filter @algogent/extension dev` produces a Chrome-loadable build.
