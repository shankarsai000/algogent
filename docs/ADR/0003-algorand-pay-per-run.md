# ADR 0003: Algorand pay-per-completed-run

## Status

Accepted (Phase 3)

## Context

Algogent must charge only when a skill run succeeds, and split funds between skill developer and platform in one settlement.

## Decision

1. **Gate**: `shouldChargeOnResult` — only `success` triggers settlement.
2. **Plan**: `buildPaymentPlan` splits `amountMicro` by `platformFeeBps`.
3. **Network**: default **Testnet**; `simulate: true` until wallet + algosdk broadcast is configured.
4. **Atomic split (target)**: two payment legs in one atomic group (developer + platform).
5. **Receipts**: stored locally in `chrome.storage.local` (no custodial server in v1).
6. **Wallet**: ARC-0027 `window.algorand` when available; otherwise simulate mode.

## Consequences

- CI and local dev work without a funded wallet.
- On-chain path is explicit and fails closed until configured.
- x402 HTTP micropayments can wrap the same plan object later without changing the gate.
