# Algogent

Browser extension marketplace for AI agent skills. Run tasks across **ChatGPT** and **Claude** (Gemini/Meta next) from one side panel. Pay per completed run on Algorand in Phase 3.

| Milestone | Ref on GitHub |
|-----------|----------------|
| Phase 1 frozen | branch [`phase-1`](https://github.com/shankarsai000/algogent/tree/phase-1) |
| Phase 2 (current) | [`main`](https://github.com/shankarsai000/algogent) |

## Quick start

```bash
git clone https://github.com/shankarsai000/algogent.git
cd algogent
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```

Load unpacked from WXT output → open ChatGPT or Claude → search/filter skills → run.

## Phase 2 highlights

- Side panel search + provider chips
- ChatGPT + Claude content adapters
- Shared Zod skill validation

## Docs

[SDLC](docs/SDLC.md) · [Architecture](docs/ARCHITECTURE.md) · [Permissions](docs/PERMISSIONS.md) · [Changelog](CHANGELOG.md)

## License

MIT
