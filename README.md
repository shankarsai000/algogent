# Algogent

**Open, portable AI skills** that run on **ChatGPT, Claude, Gemini, and Meta AI** — using the accounts you already have.

Many skills are **free**. Paid skills charge **only when a run succeeds**. Failed runs are never charged.

> Custom GPTs lock skills inside one vendor. Skills should be open, portable, and fair to creators.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](RELEASE.md)
[![Spec](https://img.shields.io/badge/Open%20Skill%20Format-0.1-brightgreen)](spec/README.md)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Demo

![Algogent product demo](docs/assets/demo.gif)

**Story:** title → locked silos → free skills side panel → “Done · free skill · no charge” → Open Skill Format + repo CTA.

- GIF: [`docs/assets/demo.gif`](docs/assets/demo.gif) (silent — GIF format)
- MP4 + audio: [`docs/assets/algogent-demo.mp4`](docs/assets/algogent-demo.mp4)
- SVG fallback: [`docs/assets/demo.svg`](docs/assets/demo.svg)

```text
Side panel → Free skill → inject into active ChatGPT/Claude tab
    → success → no charge (amountMicro: 0)
Paid skill → success → PaymentPlan → settlement → Receipt
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

**Requirements:** Node 20+, pnpm 9+, Chrome.

```bash
git clone https://github.com/shankarsai000/algogent.git
cd algogent
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/extension dev
```

1. `chrome://extensions` → **Developer mode** → **Load unpacked** → WXT output folder  
2. Open [ChatGPT](https://chatgpt.com) or [Claude](https://claude.ai) (logged in)  
3. Algogent side panel → **Free** skill → **Run**  

No wallet required for free skills.

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
| Regex helper | Pattern + examples |
| Threat model sketch | Assets, boundaries, mitigations |
| Translate (formal) | Formal register + ambiguity notes |
| Blog / thread outline | Structure + optional thread skeleton |

See [`skills/`](skills/) · Spec: [`spec/`](spec/README.md).

---

## Open Skill Format

```text
skills/my-skill/
  manifest.json   # id, providers, pricing, inputs
  SKILL.md        # prompt with {{placeholders}}
```

`amountMicro: 0` = free. Contribute via [`skills/_template/`](skills/_template/) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Architecture

```text
Side panel → RUN_SKILL → content adapters (ChatGPT/Claude/Gemini/Meta AI)
         → SkillResult
         → shouldChargeOnResult → PaymentPlan → SettlementProvider → Receipt
```

| Package | Role |
|---------|------|
| `packages/shared` | Schemas, plan math, skill body render |
| `packages/extension` | MV3 app, adapters, payments, UI |
| `spec/` | Open Skill Format |
| `skills/` | Seed + community skills |

---

## Payments (optional)

```text
success → PaymentPlan → simulate | x402_base | x402_solana | stripe_balance → Receipt
```

Free skills never open a rail. See [docs/PAYMENTS.md](docs/PAYMENTS.md).

---

## Compare

| | Custom GPT / Gem | MCP only | **Algogent** |
|--|------------------|----------|--------------|
| Portable across chat UIs | No | N/A | **Yes** |
| Logged-in session | Yes | No | **Yes** |
| Success-gated micro-pay | No | DIY | **Yes** |
| Open skill packages | No | Partial | **Yes** |

---

## Docs

[RELEASE.md](RELEASE.md) · [Launch checklist](docs/LAUNCH_CHECKLIST.md) · [Show HN](docs/SHOW_HN.md) · [Architecture](docs/ARCHITECTURE.md) · [Threat model](docs/THREAT_MODEL.md) · [Privacy](docs/PRIVACY_POLICY.md) · [Security](SECURITY.md)

## Status

**1.0.0 freeze.** Provider DOMs may change; adapters can need fixes after UI redesigns. Prefer free skills until live x402 is production-hardened.

## License

[MIT](LICENSE)
