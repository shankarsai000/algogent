# Extension permissions

Algogent uses the minimum MV3 permissions required for Phase 1.

| Permission | Why |
|------------|-----|
| `sidePanel` | Primary UI surface for the skill marketplace |
| `storage` | Local prefs and future run receipts (Phase 3) |
| `activeTab` | Identify the tab the user is working in |
| `tabs` | Read active tab URL for provider detection |
| `scripting` | Ensure content scripts can interact with provider pages |

## Host permissions

Limited to official LLM web origins needed for adapters:

- `https://chatgpt.com/*`, `https://chat.openai.com/*` (Phase 1 adapter)
- `https://claude.ai/*`, `https://gemini.google.com/*`, `https://meta.ai/*`, `https://www.meta.ai/*` (reserved for Phase 2+)

## Data handling

- Skill prompts are injected only into the active provider tab the user already has open.
- Chat content is **not** uploaded to Algogent servers in Phase 1.
- No private keys are stored in content scripts.
