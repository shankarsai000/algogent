# ADR 0003 — Original pay-per-run (Algorand)

**Status:** Superseded by [0004-pluggable-settlement-x402.md](./0004-pluggable-settlement-x402.md)

## Context

Early design used Algorand-native micro-payments for success-gated skill runs.

## Decision (historical)

Charge only on successful runs; split developer / platform fees on-chain.

## Supersession

Settlement is now **pluggable**. Primary path is **x402 USDC (Base)** with `simulate` for dev/free onboarding. Algorand may remain as an optional future rail but is not required for 1.0.0.
