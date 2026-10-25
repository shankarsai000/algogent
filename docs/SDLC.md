# Algogent SDLC

Structured path from zero to production-grade product.

## Principles

1. **Ship thin vertical slices** — each phase delivers a demoable capability.
2. **Contracts first** — shared types and skill schema before UI polish.
3. **Security by default** — least privilege extension permissions; never exfiltrate chat content to third parties without explicit user action.
4. **Test what settles money** — payment and completion detection are the highest-value test targets.
5. **Document decisions** — ADRs for architecture choices that are hard to reverse.

## Phases

### Phase 0 — Foundation

**Exit criteria**

- [x] Repo created with private visibility
- [x] `shared` package with skill schema
- [x] Extension package scaffold
- [x] CI typecheck / lint / test pipeline
- [x] SDLC + architecture docs

### Phase 1 — Extension shell & provider adapters (in progress on `feat/phase-1-extension-shell`)

**Goals**

- MV3 side panel UI (WXT)
- Content-script adapter: inject prompt + observe completion on ChatGPT
- Provider detection from active tab URL

**Exit criteria**

- [x] Side panel lists seed skills and collects inputs
- [x] "Run skill" routes through background → ChatGPT content script
- [x] Completion detection helpers + unit tests
- [x] Permissions documented (`docs/PERMISSIONS.md`)
- [ ] Manual smoke test on real ChatGPT tab (local `pnpm dev`)

### Phase 2 — Skill runtime & catalog

**Goals**

- Load skills from packaged `skills/` + validation
- Claude adapter
- Marketplace search/filter UX

### Phase 3 — Payments (Algorand)

**Goals**

- Wallet connect; charge only on verified completion
- Atomic developer + platform split (Testnet first)

### Phase 4 — Hardening & distribution

**Goals**

- Threat model, CSP, store submission
- Gemini + Meta AI adapters as capacity allows

### Phase 5 — Production operations

**Goals**

- Opt-in error reporting, versioned releases, support channel

## Quality gates (every PR)

| Gate | Tooling |
|------|---------|
| Types | `tsc --noEmit` |
| Lint | package lint scripts |
| Unit tests | Vitest |
| Secrets | No hardcoded keys |

## Branching

- `main` — always releasable
- `feat/*`, `fix/*`, `chore/*` — short-lived PRs
- Prefer squash merge
