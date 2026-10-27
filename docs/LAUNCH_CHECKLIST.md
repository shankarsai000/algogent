# Launch checklist (complete)

## A. Repo readiness

- [x] Open Skill Format (`spec/`)
- [x] Free-tier path (no wallet for free skills)
- [x] 15 seed skills
- [x] README, CONTRIBUTING, LICENSE, SECURITY, CoC
- [x] Issue + PR templates
- [x] Show HN / social drafts (`docs/SHOW_HN.md`)
- [ ] **Repo set to Public** (GitHub → Settings → General → Change visibility)
- [ ] Topics: `ai`, `chatgpt`, `claude`, `browser-extension`, `agents`, `openai`, `anthropic`, `typescript`
- [ ] About description: `Open portable AI skills for ChatGPT, Claude, Gemini & Meta AI. Pay only on success.`
- [ ] Homepage URL (optional): repo or docs site

## B. Demo asset (blocking for launch posts)

- [ ] Record 20–30s screen capture:
  1. Open ChatGPT
  2. Open Algogent side panel
  3. Run **Summarize text** (Free)
  4. Show status “Done · free skill”
- [ ] Export GIF or MP4
- [ ] Add to README under **Demo** (see placeholder)

### How to capture (macOS example)

```bash
# QuickTime or CleanShot → GIF
# Or: chrome://extensions load unpacked, then record window
```

## C. Local verify

```bash
git pull origin main
pnpm install
pnpm --filter @algogent/shared build
pnpm --filter @algogent/shared test
pnpm --filter @algogent/extension test
pnpm --filter @algogent/extension dev
```

- [ ] Load unpacked in Chrome
- [ ] Free skill works on ChatGPT
- [ ] Free skill works on Claude
- [ ] Failed run shows “no charge”

## D. Launch day timeline

| Time (ET) | Action |
|-----------|--------|
| T−1 day | Public repo, GIF in README, topics set |
| 8:00–10:00 | Post **Show HN** |
| +30 min | X thread + GIF |
| +1 h | r/ChatGPT, r/claudeai (read rules first) |
| All day | Reply to every comment |
| EOD | Ship one fix from feedback; open 2–3 `good first issue`s |

## E. After launch (48h)

- [ ] Pin issue: “Welcome / how to add a skill”
- [ ] Label backlog `good first issue`, `skill`, `adapter`
- [ ] Thank first contributors publicly
- [ ] Optional: Product Hunt (once demo is polished)

## F. Messaging rules

**Lead with:** portable skills, no API keys, free default, multi-UI.  
**Do not lead with:** Algorand, crypto, wallets, “get rich with agents.”
