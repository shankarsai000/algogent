# Privacy policy (draft for Chrome Web Store)

**Last updated:** 2026-10-25

Algogent is a browser extension that helps you run reusable AI skills in the LLM web apps you already use, and optionally settle small payments on Algorand.

## Data we process

| Data | Where | Shared with third parties? |
|------|--------|----------------------------|
| Skill inputs you type in the side panel | Your device; injected only into the active provider tab you chose | No Algogent server in v1 |
| Active tab URL (for provider detection) | Extension service worker, transient | No |
| Wallet address (if you connect) | `chrome.storage.local` on your device | Only as required for on-chain transactions you approve |
| Payment receipts | `chrome.storage.local` on your device | No |

## Data we do **not** collect (Phase 4 product intent)

- Full chat history from ChatGPT/Claude/Gemini/Meta AI uploaded to Algogent servers
- Seed phrases or private keys
- Advertising profiles

## Permissions

See [PERMISSIONS.md](./PERMISSIONS.md). Permissions are limited to operating the side panel, detecting the active provider tab, and interacting with listed host origins.

## Contact

Repository maintainer: https://github.com/shankarsai000/algogent

This draft should be reviewed by counsel before store publication.
