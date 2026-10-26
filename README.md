# Algogent

**Open, portable AI skills** that run on **ChatGPT, Claude, Gemini, and Meta AI** — using the accounts you already have.  
Authors get paid **only when a run succeeds** (USDC micro-payments). Many skills are **free**.

> Custom GPTs are locked to one vendor. Skills should be open, portable, and fair to creators.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spec](https://img.shields.io/badge/Open%20Skill%20Format-0.1-brightgreen)](spec/README.md)

---

## Why

| Problem | Algogent |
|---------|----------|
| Skills trapped in one chat product | **Open Skill Format** — one package, many runners |
| Re-setup when you switch models | Same skill on ChatGPT *and* Claude |
| Subscriptions for one-off tasks | **Pay per successful run** (or free) |
| Creators can’t earn across platforms | Pricing in the skill manifest |

---

## Quick start

```bash
git clone https://github.com/shankarsai000/algogent.git
cd algogent
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/extension dev
```

1. Chrome → `chrome://extensions` → Developer mode → **Load unpacked** → WXT output folder  
2. Open [ChatGPT](https://chatgpt.com) or [Claude](https://claude.ai)  
3. Open the Algogent side panel → pick a **free** skill → run  

No wallet required for free skills or the first free runs.

---

## Demo flow

```text
Side panel → Summarize text (free)
    → inject into active tab
    → success → no charge (amountMicro: 0)

Paid skill → success → PaymentPlan → x402 USDC (Base) / simulate / balance
Failed run → never charged
```

*(Replace this section with a 20s GIF before launch.)*

---

## Open Skill Format

Skills live under [`skills/`](skills/) and follow [`spec/`](spec/README.md):

```text
skills/summarize-text/
  manifest.json
  SKILL.md
```

Publish by PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Payments (optional)

```text
success → shouldChargeOnResult → PaymentPlan → SettlementProvider → Receipt
```

| Rail | Role |
|------|------|
| `simulate` | Default for dev / free path |
| `x402_base` | Primary USDC micropayments |
| `x402_solana` | Optional |
| `stripe_balance` | Prepaid balance after fiat top-up |

Details: [docs/PAYMENTS.md](docs/PAYMENTS.md)

---

## Repo map

| Path | Purpose |
|------|---------|
| `spec/` | Open Skill Format |
| `skills/` | Seed + community skills |
| `packages/extension` | Chrome MV3 side panel |
| `packages/shared` | Schemas & plan math |
| `docs/` | Architecture, threat model, launch |

---

## Compare

| | Custom GPT / Gem | MCP only | **Algogent** |
|--|------------------|----------|--------------|
| Portable across chat UIs | No | N/A | **Yes** |
| Uses logged-in session | Yes | No | **Yes** |
| Success-gated micro-pay | No | DIY | **Yes** |
| Open skill packages | No | Partial | **Yes** |

---

## Status

Early public build. APIs and DOM adapters may change. Skills with `amountMicro: 0` are the recommended default until settlement is production-hardened.

## License

MIT
