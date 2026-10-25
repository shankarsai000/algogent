# Algogent

**Browser extension marketplace for AI agent skills.**

Run tasks across ChatGPT, Claude, Gemini, and Meta AI from one side panel using your existing logged-in sessions. Pay only for completed agent runs via small Algorand micropayments — no monthly subscription.

> Status: **Phase 1** — side panel + ChatGPT adapter on branch `feat/phase-1-extension-shell`

## Vision

| Problem | Algogent approach |
|---------|-------------------|
| Fragmented AI provider UIs | Unified side-panel control plane over existing sessions |
| Subscription pricing for sporadic agent work | Pay-per-successful-run on Algorand |
| Hard-to-monetize reusable skills | Marketplace with atomic on-chain developer / platform split |

## Repository layout

```
algogent/
├── docs/                 # Architecture, SDLC, ADRs, permissions
├── packages/
│   ├── shared/           # Types, skill schema, pure utilities
│   └── extension/        # Chrome MV3 extension (WXT)
└── skills/               # Canonical skill sources (mirrored in extension catalog)
```

## Quick start

```bash
git clone https://github.com/shankarsai000/algogent.git
cd algogent
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```

Then Chrome → `chrome://extensions` → Developer mode → **Load unpacked** → select `packages/extension/.output/chrome-mv3` (path may vary slightly by WXT version).

1. Open https://chatgpt.com and sign in.
2. Open the Algogent side panel.
3. Pick a skill, enter inputs, run.

## Permissions

See [docs/PERMISSIONS.md](docs/PERMISSIONS.md).

## SDLC

See [docs/SDLC.md](docs/SDLC.md).

## License

MIT — see [LICENSE](LICENSE).
