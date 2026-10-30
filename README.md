# Algogent

**Open, portable AI skills** that run on **ChatGPT, Claude, Gemini, and Meta AI** — using the accounts you already have.

Many skills are **free**. Paid skills charge **only when a run succeeds** (USDC micropayments via pluggable settlement). Failed runs are never charged.

> Custom GPTs lock skills inside one vendor. Skills should be open, portable, and fair to creators.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spec](https://img.shields.io/badge/Open%20Skill%20Format-0.1-brightgreen)](spec/README.md)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Demo

![Algogent product demo](docs/assets/demo.svg)

**Story (27s):** title → locked silos → free skills side panel → “Done · free skill · no charge” → Open Skill Format + repo CTA.

| Asset | Path | Notes |
|-------|------|--------|
| Animated SVG | [`docs/assets/demo.svg`](docs/assets/demo.svg) | Renders on GitHub |
| GIF | `docs/assets/demo.gif` | Add via local commit ([instructions](docs/assets/README.md)) |
| MP4 + audio | `docs/assets/algogent-demo.mp4` | Same; GIF has **no** audio by format |

```text
Side panel → pick Free skill → inject into active ChatGPT/Claude tab
    → success → no charge (amountMicro: 0)
Paid skill → success → PaymentPlan → settlement rail → Receipt
Failed run → never charged
```

---

## Why Algogent

| Problem | Algogent |
|---------|----------|
| Skills trapped in one chat product | **Open Skill Format** — one package, many runners |
| Re-setup when you switch models | Same skill on ChatGPT *and* Claude |
| Subscriptions for one-off tasks | **Free** or **pay per successful run** |
| Creators can’t earn across platforms | Optional pricing in the skill manifest |
| API keys for casual runs | Uses **your logged-in browser session** |

---

## Quick start

### Requirements

- Node 20+
- [pnpm](https://pnpm.io) 9+
- Chrome (MV3 extension)

### Install & run

```bash
git clone https://github.com/shankarsai000/algogent.git
cd algogent
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/extension dev
```

1. Open `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select the WXT output folder (printed by `dev`, often `packages/extension/.output/chrome-mv3`)
3. Open [ChatGPT](https://chatgpt.com) or [Claude](https://claude.ai) while logged in
4. Open the **Algogent** side panel → choose a **Free** skill → **Run**

**No wallet required** for free skills (`amountMicro: 0`).

### Tests

```bash
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
```

---

## Seed skills (all free)

| Skill | Use |
|-------|-----|
| Summarize text | Bullet summary without inventing facts |
| Rewrite for clarity | Simpler language, same meaning |
| Meeting notes → actions | Decisions, checkboxes, open questions |
| PR review | Blockers, suggestions, risk |
| Explain code | Walkthrough + pitfalls |
| Commit message | Conventional commits |
| Email reply draft | Tone + goal |
| Explain like I'm 5 | Simple + accurate one-liner |
| Bug bisect plan | Hypotheses + ordered checks |
| Explain SQL | Meaning + performance notes |
| Resume bullets | Impact-focused bullets |
| Regex helper | Pattern + match/non-match examples |
| Threat model sketch | Assets, boundaries, mitigations |
| Translate (formal) | Formal register + ambiguity notes |
| Blog / thread outline | Structure + optional thread skeleton |

Packages live under [`skills/`](skills/). Spec: [`spec/`](spec/README.md).

---

## Open Skill Format (OSF)

```text
skills/my-skill/
  manifest.json   # id, providers, pricing, inputs
  SKILL.md        # prompt body with {{placeholders}}
```

Example input binding: `{{text}}` in `SKILL.md` ↔ `inputs[].key = "text"`.

Pricing: `amountMicro: 0` = free. Positive values use USDC micro-units (e.g. `50000` = $0.05).

Contribute with [`skills/_template/`](skills/_template/) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  Side panel (MV3)  →  catalog / filters / run form        │
└───────────────────────────┬─────────────────────────────┘
                            │ RUN_SKILL
┌───────────────────────────▼─────────────────────────────┐
│  Background + content adapters                           │
│  ChatGPT · Claude · Gemini · Meta AI  (session DOM)      │
└───────────────────────────┬─────────────────────────────┘
                            │ SkillResult success|failed
┌───────────────────────────▼─────────────────────────────┐
│  shouldChargeOnResult → PaymentPlan → SettlementProvider │
│  rails: simulate · x402_base · x402_solana · stripe_bal. │
│  Receipt → chrome.storage.local                          │
└─────────────────────────────────────────────────────────┘
```

| Package | Role |
|---------|------|
| `packages/shared` | Zod schemas, `buildPaymentPlan`, skill body render |
| `packages/extension` | WXT MV3 app, adapters, payments, UI |
| `spec/` | Open Skill Format docs |
| `skills/` | Seed + community skills |
| `docs/` | Payments, threat model, launch |

---

## Payments (optional)

```text
success → shouldChargeOnResult === true
       → PaymentPlan (amount, developerShare, platformShare)
       → Settlement adapter (pluggable)
            ├─ x402 USDC (Base)     ← primary
            ├─ x402 USDC (Solana)   ← optional
            ├─ Simulate             ← dev / free-tier allowance
            └─ Stripe balance burn  ← optional fiat top-up
       → Receipt in local storage
```

- Free skills never open a rail.
- First few *paid* successes can force **simulate** so onboarding needs no wallet.
- Details: [docs/PAYMENTS.md](docs/PAYMENTS.md) · ADR: `docs/ADR/`

---

## Compare

| | Custom GPT / Gem | MCP only | **Algogent** |
|--|------------------|----------|--------------|
| Portable across chat UIs | No | N/A | **Yes** |
| Uses logged-in session | Yes | No | **Yes** |
| Success-gated micro-pay | No | DIY | **Yes** |
| Open skill packages | No | Partial | **Yes** |

---

## Repo map

```text
algogent/
  spec/                 Open Skill Format
  skills/               Seed skills + _template
  packages/
    shared/             Schemas & plan math
    extension/          Chrome MV3 side panel
  docs/
    assets/             demo.svg (+ gif/mp4 when committed)
    LAUNCH_CHECKLIST.md
    SHOW_HN.md
    PAYMENTS.md
  CONTRIBUTING.md
  SECURITY.md
  LICENSE
```

---

## Launch & community

- [Launch checklist](docs/LAUNCH_CHECKLIST.md) — public repo, topics, Show HN timing
- [Show HN / social drafts](docs/SHOW_HN.md)
- [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Code of conduct](CODE_OF_CONDUCT.md)

**Suggested GitHub About**

> Open portable AI skills for ChatGPT, Claude, Gemini & Meta AI. Pay only on success.

**Topics:** `ai` `chatgpt` `claude` `browser-extension` `agents` `typescript` `openai` `anthropic`

---

## Status

Early public build (`0.6.x`). Provider DOMs change; adapters may need updates after UI redesigns. Prefer free skills until live x402 facilitators are production-hardened.

## License

[MIT](LICENSE)
