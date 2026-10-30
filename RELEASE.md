# Release 1.0.0 — freeze

**Date:** 2026-10-30  
**Tag recommendation:** `v1.0.0`  
**Branch:** `main`

This release freezes the OSS launch surface. Prefer issues/PRs for further work rather than rewriting core docs without need.

## Included

- Open Skill Format (`spec/`)
- Chrome MV3 extension (WXT) with ChatGPT, Claude, Gemini, Meta AI adapters
- 15 free seed skills under `skills/`
- Success-gated payments + pluggable settlement (`simulate`, `x402_base`, `x402_solana`, `stripe_balance`)
- Free-tier path (no wallet for free skills)
- Product demos: `docs/assets/demo.gif`, `algogent-demo.mp4`, `demo.svg`
- CI, CONTRIBUTING, SECURITY, CoC, launch drafts

## Known limits (accepted for 1.0.0)

| Area | Status |
|------|--------|
| Live x402 facilitator | Optional / not required for free skills |
| Provider DOM selectors | Fragile; may break when UIs change |
| Chrome Web Store publish | Not submitted in this freeze |
| Repo visibility | Operator must set **Public** for OSS launch |
| Wallet UX | Optional; simulate allowance for early paid runs |

## Operator checklist after freeze

1. `git tag -a v1.0.0 -m "Algogent 1.0.0 freeze" && git push origin v1.0.0`
2. GitHub → Settings → make repository **Public**
3. About description + topics (see README)
4. Optional: Show HN using `docs/SHOW_HN.md`

## Verify locally

```bash
pnpm install
pnpm --filter @algogent/shared build && pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```
