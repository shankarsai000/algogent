# Threat model (Phase 4)

## Assets

| Asset | Sensitivity |
|-------|-------------|
| User LLM session cookies (browser-managed) | High — never exfiltrated by Algogent |
| Skill prompts / user inputs in side panel | Medium |
| Wallet address + signed tx intent | High |
| Local payment receipts | Low–medium |

## Trust boundaries

1. **Side panel / service worker** — extension origin; may hold prefs + receipts.
2. **Content scripts** — run in provider page context; **must not** hold keys.
3. **Provider origins** — ChatGPT, Claude, Gemini, Meta AI; untrusted from our POV for payment.
4. **Algorand network** — settlement layer; Testnet vs Mainnet explicit in config.

## Threats & mitigations

| Threat | Mitigation |
|--------|------------|
| Malicious skill prompt steals data via model | Skills treated as untrusted text; no auto-escalation of permissions |
| Content script XSS from page | Minimal DOM writes; no `innerHTML` of model output in extension UI without escape |
| Over-broad host permissions | Only listed LLM origins |
| Charge on failed runs | `shouldChargeOnResult` gate |
| Custodial key theft | No custodial wallet; ARC-0027 / user wallet only |
| Supply-chain (deps) | Pin packageManager; CI typecheck/test |

## Non-goals (v1)

- Guaranteeing provider UI selector stability forever
- Server-side chat logging
- Formal formal verification of settlement contracts
