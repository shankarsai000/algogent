# Algogent SDLC

## Policy

- Develop on **`main`** only.
- Freeze phases as branches: `phase-1`, `phase-2`, `phase-3`, …

## Phases

| Phase | Status | Ref |
|-------|--------|-----|
| 0 Foundation | ✅ | early main |
| 1 Extension + ChatGPT | ✅ | `phase-1` |
| 2 Claude + catalog UX | ✅ | `phase-2` |
| 3 Algorand pay-per-run | 🚧 on `main` | — |
| 4 Hardening / store | Pending | — |
| 5 Production ops | Pending | — |

### Phase 3 exit criteria

- [x] Charge only on successful runs
- [x] Atomic split plan (developer / platform)
- [x] Simulate settlement + local receipts
- [x] Wallet connect surface (ARC-0027 / simulate)
- [ ] Live Testnet broadcast with real addresses + algosdk sign/send
- [ ] Manual funded-wallet smoke test
