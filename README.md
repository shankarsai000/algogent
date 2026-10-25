# Algogent

Browser extension marketplace for AI agent skills. Run on **ChatGPT** / **Claude**. **Pay only when a run succeeds**, with Algorand Testnet micropayments split between developer and platform.

| Milestone | Ref |
|-----------|-----|
| Phase 1 | [`phase-1`](https://github.com/shankarsai000/algogent/tree/phase-1) |
| Phase 2 | [`phase-2`](https://github.com/shankarsai000/algogent/tree/phase-2) |
| Phase 3 (current) | [`main`](https://github.com/shankarsai000/algogent) |

## Quick start

```bash
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```

Default payment mode is **simulate** (no chain broadcast). Set `paymentSimulate: false` and real addresses in extension storage for Testnet.

## Phase 3 payment rules

1. Skill runs on the active provider tab.
2. If status ≠ `success` → **no charge**.
3. If success → build payment plan → simulate or atomic on-chain split → save receipt.

## License

MIT
