# Algogent

Browser extension marketplace for AI agent skills (ChatGPT, Claude, Gemini, Meta AI).
**Pay only when a run succeeds** — settlement is pluggable:

```
success → PaymentPlan → x402 USDC (Base) | Solana | simulate | Stripe balance → Receipt
```

## Quick start

```bash
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```

Default rail is **x402_base** with **simulate fallback** until a facilitator URL is set.

## Docs

[Payments](docs/PAYMENTS.md) · [ADR 0004](docs/ADR/0004-pluggable-settlement-x402.md) · [SDLC](docs/SDLC.md) · [Threat model](docs/THREAT_MODEL.md)

## License

MIT
