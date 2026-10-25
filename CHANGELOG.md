# Changelog

## [0.5.0-settlement] — 2026-10-25

### Added
- Pluggable `SettlementProvider` registry
- Rails: `x402_base` (primary), `x402_solana`, `simulate`, `stripe_balance`
- Local USDC prepaid balance store for fiat top-up path
- ADR 0004 + PAYMENTS.md
- Default skill pricing in USDC

### Changed
- Settlement no longer Algorand-only; plan is rail-agnostic

## Prior phases

See git branches `phase-1` … `phase-3` and earlier changelog entries on main.
