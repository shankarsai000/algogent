# Contributing to Algogent

Thanks for helping build **open, portable AI skills**.

## Ways to contribute

1. **Skills** — add a package under `skills/` (highest impact)
2. **Provider adapters** — fix selectors when ChatGPT/Claude/Gemini/Meta UI changes
3. **Docs / README** — clarity, GIFs, translations
4. **Tests** — unit tests for shared + payments

## Add a skill (Open Skill Format)

```bash
cp -r skills/_template skills/my-skill-id
# edit manifest.json + SKILL.md
```

Requirements:

- `id` is kebab-case and unique
- `SKILL.md` uses `{{inputKey}}` placeholders matching `inputs`
- Prefer **`amountMicro: 0`** (free) unless you document paid behavior
- Skill must not instruct models to exfiltrate secrets or bypass safety

Open a PR with:

- What the skill does
- One example input/output (in PR body or `README.md`)

## Dev setup

```bash
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```

## Code style

- TypeScript strict
- No secrets in git
- Charge **only** on successful runs (`shouldChargeOnResult`)

## License

By contributing, you agree your work is MIT-licensed, same as the repo.
