# Security

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` (latest) | Yes |
| Older tags | Best effort |

## Reporting a vulnerability

Please **do not** open a public issue for security bugs.

Email or DM the maintainer via GitHub (@shankarsai000) with:

- Description and impact
- Steps to reproduce
- Affected commit if known

We aim to acknowledge within a few days.

## Scope notes

- Algogent **does not** hold user LLM API keys; it uses the browser session on provider sites.
- Content scripts run in provider page contexts — treat provider DOM as untrusted.
- Never paste seed phrases or private keys into skill inputs or issues.
- Payment rails (x402 / wallets) are optional; free skills charge nothing.
