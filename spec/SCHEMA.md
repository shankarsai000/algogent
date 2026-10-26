# OSF Schema (0.1)

Canonical shapes mirror `@algogent/shared` Zod schemas.

## SkillManifest

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | `^[a-z0-9][a-z0-9-]*$`, max 64 |
| `name` | string | yes | Display name |
| `version` | string | yes | Semver recommended |
| `description` | string | yes | Max 2000 chars |
| `author` | string | yes | Handle or name |
| `license` | string | no | Default MIT if omitted in registry |
| `providers` | string[] | yes | `chatgpt` \| `claude` \| `gemini` \| `meta_ai` |
| `pricing` | object | yes | See below |
| `bodyPath` | string | no | Default `SKILL.md` |
| `tags` | string[] | no | Discovery |
| `inputs` | object[] | no | Form fields |

## Pricing

| Field | Type | Description |
|-------|------|-------------|
| `amountMicro` | int ≥ 0 | Micro-units; **0 = free** |
| `asset` | `USDC` \| `ALGO` | Unit of account (prefer USDC) |
| `platformFeeBps` | 0–10000 | Platform share of paid runs |
| `developerPayTo` | string | EVM / Solana / Algorand address |

## Input

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Placeholder name |
| `label` | string | UI label |
| `required` | boolean | Default true |
| `placeholder` | string | Optional hint |

## Runner contract

1. Render `SKILL.md` with inputs → `renderedBody`
2. Inject into active provider session
3. On completion → `success` \| `failed` \| `cancelled`
4. Charge **only** if `success` **and** `amountMicro > 0`
