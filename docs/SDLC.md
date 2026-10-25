# Algogent SDLC

Structured path from zero to production-grade product.

## Principles

1. **Ship thin vertical slices** — each phase delivers a demoable capability.
2. **Contracts first** — shared types and skill schema before UI polish.
3. **Security by default** — least privilege extension permissions; never exfiltrate chat content to third parties without explicit user action.
4. **Test what settles money** — payment and completion detection are the highest-value test targets.
5. **Document decisions** — ADRs for architecture choices that are hard to reverse.

## Phases

### Phase 0 — Foundation (current)

**Goals**

- Monorepo, tooling, CI
- Skill + payment domain types
- Architecture and coding standards

**Exit criteria**

- [x] Repo created with private visibility
- [x] `shared` package with skill schema
- [x] Extension package scaffold
- [x] CI typecheck / lint / test pipeline
- [x] SDLC + architecture docs

### Phase 1 — Extension shell & provider adapters

**Goals**

- MV3 side panel UI
- Content-script adapters that can inject a prompt and observe a response on at least one provider (ChatGPT first)
- Provider detection from active tab URL

**Exit criteria**

- [ ] Side panel opens and lists mock skills
- [ ] "Run skill" injects prompt into ChatGPT web UI and captures completion signal
- [ ] Unit tests for adapter pure helpers
- [ ] Permissions documented and minimal

### Phase 2 — Skill runtime & catalog

**Goals**

- Load skills from local catalog / packaged `skills/`
- Skill runner: expand template → execute on selected provider → report status
- Basic marketplace UI (search, category, price display)

**Exit criteria**

- [ ] At least 3 seed skills runnable end-to-end on ChatGPT
- [ ] Skill validation against Zod schema
- [ ] Claude adapter (second provider)

### Phase 3 — Payments (Algorand)

**Goals**

- Wallet connect (Pera / Lute / wallet standard)
- Charge only on verified completion
- Atomic split: developer + platform in one group transaction (Testnet first)

**Exit criteria**

- [ ] Testnet payment succeeds after mocked completion
- [ ] Failed runs do not charge
- [ ] Receipt stored locally with tx id
- [ ] ADR for x402 vs direct payment flow

### Phase 4 — Hardening & distribution

**Goals**

- Threat model, CSP, permission audit
- E2E smoke tests
- Chrome Web Store package + privacy policy
- Gemini + Meta AI adapters as capacity allows

**Exit criteria**

- [ ] Security checklist signed off
- [ ] CI green on main
- [ ] Store listing assets ready

### Phase 5 — Production operations

**Goals**

- Error reporting (opt-in), versioned skill registry API if needed
- Support channel, changelog, semantic versioning releases

## Quality gates (every PR)

| Gate | Tooling |
|------|---------|
| Types | `tsc --noEmit` |
| Lint | ESLint |
| Unit tests | Vitest |
| Secrets | No hardcoded keys |

## Branching

- `main` — always releasable
- `feat/*`, `fix/*`, `chore/*` — short-lived PRs
- Prefer squash merge
