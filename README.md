# Algogent

**Browser extension marketplace for AI agent skills.**

Run tasks across ChatGPT, Claude, Gemini, and Meta AI from one side panel using your existing logged-in sessions. Pay only for completed agent runs via small Algorand micropayments — no monthly subscription.

> Status: **Phase 0 → Phase 1** (foundation complete, core extension in progress)

## Vision

| Problem | Algogent approach |
|---------|-------------------|
| Fragmented AI provider UIs | Unified side-panel control plane over existing sessions |
| Subscription pricing for sporadic agent work | Pay-per-successful-run on Algorand |
| Hard-to-monetize reusable skills | Marketplace with atomic on-chain developer / platform split |

## Architecture (high level)

```
┌─────────────────────────────────────────────────────────┐
│  Browser (MV3 Extension)                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Side Panel  │  │ Skill Runner │  │ Provider Adapters│ │
│  │ (UI + shop) │──│ (orchestrate)│──│ ChatGPT/Claude/  │ │
│  └─────────────┘  └──────┬───────┘  │ Gemini/Meta AI   │ │
│                          │          └─────────────────┘ │
│  ┌───────────────────────▼────────────────────────────┐ │
│  │ Payment Client (Algorand / x402-style micropay)    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Repository layout

```
algogent/
├── docs/                 # Architecture, SDLC, ADRs
├── packages/
│   ├── shared/           # Types, skill schema, pure utilities
│   └── extension/        # Chrome MV3 extension (side panel + adapters)
├── skills/               # Example / seed skills (SKILL.md + manifest)
└── .github/workflows/    # CI
```

## Quick start (local)

```bash
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/extension dev
```

Load the unpacked extension from `packages/extension/.output/chrome-mv3` (after first build) in `chrome://extensions`.

## SDLC roadmap

See [docs/SDLC.md](docs/SDLC.md) for phases, exit criteria, and quality gates.

| Phase | Focus |
|-------|--------|
| 0 | Repo, standards, schemas |
| 1 | Side panel + provider adapters (read/write session) |
| 2 | Skill runtime + marketplace catalog |
| 3 | Algorand pay-per-run + atomic split |
| 4 | Hardening, security review, store submission |
| 5 | Production ops (metrics, support, iteration) |

## Quality bar

- TypeScript strict mode
- Unit tests for shared domain logic
- Lint + typecheck required in CI
- No secrets in repo; env via `.env.example` only
- Conventional commits preferred

## License

MIT — see [LICENSE](LICENSE).
