# ADR 0004: Pluggable settlement (x402 USDC)

## Status

Accepted

## Context

Algorand-native transfers are not the highest-leverage default for a consumer skill marketplace. Agent micropayments in 2026 concentrate on **x402 + USDC**, primarily on **Base**, with **Solana** as a high-throughput option. Fiat users need a prepaid path.

## Decision

Keep domain logic chain-agnostic:

```
success → shouldChargeOnResult → PaymentPlan → SettlementProvider → Receipt
```

Rails:

| Rail | Role |
|------|------|
| `x402_base` | Primary production settle |
| `x402_solana` | Optional |
| `simulate` | Dev / CI / fallback |
| `stripe_balance` | Local USDC ledger after fiat top-up |

Default: `x402_base` with `allowSimulateFallback: true` until a facilitator URL is configured in `chrome.storage.local` (`x402BaseFacilitatorUrl`).

Pricing unit of account: **USDC** (micro-units, 6 decimals).

## Consequences

- New facilitators can be added without changing the success gate.
- Live on-chain requires configuring facilitator endpoints (and later wallet sign).
- Stripe never sees per-run charges from the extension; only balance top-ups (server-side) credit the local ledger.
