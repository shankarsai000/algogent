# Open Skill Format (OSF)

**Portable AI skills** that run on ChatGPT, Claude, Gemini, Meta AI — and later CLI / MCP / local models.

Custom GPTs and Claude Projects lock skills inside one product. OSF is an open package: one folder, one manifest, one body — run anywhere Algogent (or a compatible runner) supports.

## Package layout

```text
my-skill/
  manifest.json   # required — metadata, providers, pricing, inputs
  SKILL.md        # required — prompt body with {{input}} placeholders
  README.md       # optional — human docs
  examples/       # optional — sample inputs
```

## manifest.json

```json
{
  "id": "summarize-text",
  "name": "Summarize text",
  "version": "0.1.0",
  "description": "Concise bullet summary of the provided text.",
  "author": "algogent",
  "license": "MIT",
  "providers": ["chatgpt", "claude", "gemini", "meta_ai"],
  "pricing": {
    "amountMicro": 0,
    "asset": "USDC",
    "platformFeeBps": 1000,
    "developerPayTo": "0x..."
  },
  "tags": ["writing"],
  "inputs": [
    {
      "key": "text",
      "label": "Text to summarize",
      "required": true,
      "placeholder": "Paste text…"
    }
  ],
  "bodyPath": "SKILL.md"
}
```

| Field | Notes |
|-------|--------|
| `id` | kebab-case, unique in a registry |
| `providers` | Where this skill is known to work |
| `pricing.amountMicro` | USDC micro-units (`0` = free; `50000` = $0.05) |
| `inputs` | Bound to `{{key}}` in `SKILL.md` |

See [SCHEMA.md](./SCHEMA.md) for the full field list.

## SKILL.md

Markdown prompt. Placeholders use `{{inputKey}}`:

```markdown
# Summarize text

Summarize the following in 5 bullets or fewer. Do not invent facts.

## Text

{{text}}
```

## Success & payment

Runners **must not charge** unless the run is considered successful (`status: success`).  
`amountMicro: 0` skills are always free.

## Versioning

- Spec version: **0.1** (this directory)
- Skill versions: semver in `manifest.json`

## Contributing a skill

1. Copy `skills/_template/`
2. Fill `manifest.json` + `SKILL.md`
3. Open a PR to `skills/`

See [CONTRIBUTING.md](../CONTRIBUTING.md).
