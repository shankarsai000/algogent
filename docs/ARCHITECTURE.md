# Architecture

## Components

### 1. Extension (packages/extension)

Chrome Manifest V3 extension.

| Surface | Responsibility |
|---------|----------------|
| Side panel | Marketplace UI, run controls, wallet status |
| Background service worker | Message bus, payment orchestration, storage |
| Content scripts | Per-provider DOM adapters (inject prompt, detect completion) |

**Message protocol** (typed via `@algogent/shared`):

- `RUN_SKILL` → adapter executes → `SKILL_RESULT`
- `REQUEST_PAYMENT` → wallet → `PAYMENT_RECEIPT`

### 2. Shared (packages/shared)

- Zod schemas for `SkillManifest`, `SkillRunRequest`, `PaymentIntent`
- Provider enum and URL matchers
- Pure formatters and validation (no browser APIs)

### 3. Skills (skills/)

Filesystem catalog of seed skills:

```
skills/<id>/
  SKILL.md          # human-readable instructions for the model
  manifest.json     # price, providers, version, author pay-to address
```

Runtime loads manifest, validates, templates user inputs into the skill body, then sends to the active provider adapter.

### 4. Payments

**Phase 3 target**

1. User confirms run + max price.
2. Skill executes; completion detector returns success/fail.
3. On success only: build Algorand atomic group:
   - Payment leg A → skill developer ASA/ALGO address
   - Payment leg B → platform treasury
4. User signs via wallet; tx ids attached to local run receipt.

Prefer Testnet until economic and UX flows are proven.

## Security boundaries

- Content scripts never receive private keys.
- Side panel / service worker hold only non-sensitive prefs + receipt metadata.
- Host permissions limited to known LLM origins required for adapters.
- Skill content is treated as untrusted input (sanitize before DOM injection).

## Non-goals (v1)

- Hosting user chat history on Algogent servers
- Replacing official provider APIs with unofficial scraping at scale
- Custodial wallets
