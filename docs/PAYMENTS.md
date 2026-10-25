# Payments

## Pipeline

1. Skill run completes with `status: success`
2. `shouldChargeOnResult` → true
3. `buildPaymentPlan` splits developer / platform by `platformFeeBps`
4. `SettlementProvider` for the resolved rail executes
5. `PaymentReceipt` saved in `chrome.storage.local`

## Rails

| Rail | Config |
|------|--------|
| `x402_base` | `x402BaseFacilitatorUrl` |
| `x402_solana` | `x402SolanaFacilitatorUrl` |
| `simulate` | always available |
| `stripe_balance` | local `usdcBalanceMicro` (credit via `creditBalance`) |

## Defaults

- `defaultSettlementRail`: `x402_base`
- `allowSimulateFallback`: `true`
- Skill prices in **USDC** micro-units (`50000` = $0.05)

## Top-up (Stripe path)

1. Hosted Checkout / PaymentIntent on your backend credits user
2. Extension calls `creditBalance(amountMicro)` after webhook confirmation (or operator tool)
3. Successful runs use `stripe_balance` rail to burn prepaid balance
