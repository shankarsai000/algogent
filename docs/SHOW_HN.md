# Show HN & social drafts

## Show HN title

```text
Show HN: Algogent – open AI skills that run on ChatGPT, Claude, Gemini, Meta AI
```

## Show HN body

```text
Hey HN,

I built Algogent — a browser extension that runs portable “skills” on the LLM chat UIs you already use (ChatGPT, Claude, Gemini, Meta AI), without API keys.

Problem: Custom GPTs / Projects lock prompts inside one product. Switching models means redoing setup. Creators can’t package a skill once and run it everywhere.

Approach:
- Open Skill Format: manifest.json + SKILL.md ({{inputs}})
- Side panel injects into your logged-in session
- Free skills by default; optional pay-per-successful-run (USDC / simulate)
- Failed runs are never charged

Repo: https://github.com/shankarsai000/algogent

Install: pnpm install && pnpm --filter @algogent/extension dev → load unpacked in Chrome.

Looking for feedback on the skill format and provider adapters (DOM is fragile — intentional tradeoff for zero-API-key UX).
```

## X / Twitter thread (short)

```text
1/ Custom GPTs are locked to one vendor.

Algogent: open skills (manifest + SKILL.md) that run on ChatGPT, Claude, Gemini, Meta AI from one side panel.

2/ No API keys — uses the session you’re already logged into.

3/ Free by default. Paid skills only charge when the run succeeds.

4/ github.com/shankarsai000/algogent
```

## Reddit blurb

```text
Title: Open-source skill runner for ChatGPT/Claude/Gemini (no API keys)

Portable skills as markdown packages; browser extension injects into the chat UI you already use. Free seed skills included. Feedback welcome on the format.
```
