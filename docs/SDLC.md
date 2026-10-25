# Algogent SDLC

## Branch / tag policy

- All active development lands on **`main`** only.
- Phase milestones are frozen as refs: branch **`phase-1`**, **`phase-2`**, … (lightweight tags when API allows).

## Phases

### Phase 0 — Foundation ✅

Monorepo, shared schemas, docs.

### Phase 1 — Extension shell & ChatGPT ✅ (frozen: `phase-1`)

- WXT MV3, side panel, ChatGPT adapter, messaging, tests

### Phase 2 — Skill runtime & multi-provider (current on `main`)

**Exit criteria**

- [x] Search + provider filter in marketplace UI
- [x] Claude adapter + unit tests
- [x] Zod-validated seed catalog
- [ ] Manual smoke on claude.ai + chatgpt.com

### Phase 3 — Algorand pay-per-completed-run

Wallet connect, atomic developer/platform split, Testnet first.

### Phase 4 — Hardening & store

Security review, Gemini/Meta adapters, Chrome Web Store.

### Phase 5 — Production ops

Releases, support, optional telemetry.
