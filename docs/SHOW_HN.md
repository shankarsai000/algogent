# Launch copy (Show HN, Product Hunt, social)

Copy-paste when the repo is **public** and you have a short demo GIF/video.

---

## Show HN

**Title**

```text
Show HN: Algogent – open AI skills that run on ChatGPT, Claude, Gemini, Meta AI
```

**Body**

```text
Hey HN,

I built Algogent — a browser extension that runs portable “skills” on the LLM chat UIs you already use (ChatGPT, Claude, Gemini, Meta AI), without API keys.

Problem: Custom GPTs / Projects lock prompts inside one product. Switching models means redoing setup. Creators can’t package a skill once and run it everywhere.

Approach:
- Open Skill Format: manifest.json + SKILL.md ({{inputs}})
- Side panel injects into your logged-in session
- 15 free seed skills out of the box (summarize, PR review, meeting notes, …)
- Optional pay-per-successful-run (USDC); failed runs are never charged
- No wallet required for free skills

Repo: https://github.com/shankarsai000/algogent

Install:
  git clone https://github.com/shankarsai000/algogent.git
  pnpm install && pnpm --filter @algogent/shared build
  pnpm --filter @algogent/extension dev
  → Chrome load unpacked → open ChatGPT → side panel → run a Free skill

Looking for feedback on the skill format and provider adapters (DOM is fragile — intentional tradeoff for zero-API-key UX).
```

**When to post:** weekday morning US (often Tue–Thu 8–10am ET).

---

## Product Hunt (optional, day 2+)

**Tagline (≤60 chars)**

```text
Open AI skills for ChatGPT, Claude, Gemini & Meta AI
```

**Description**

```text
Algogent is an open-source browser extension that runs portable skills on the chat UIs you already use — no API keys.

• Open Skill Format (manifest + SKILL.md)
• Free seed skills for writing, code, meetings
• Optional micro-pay only when a run succeeds

Built for people tired of re-creating the same prompt in every product.
```

---

## X / Twitter thread

```text
1/ Custom GPTs are locked to one vendor.

Algogent: open skills (manifest + SKILL.md) that run on ChatGPT, Claude, Gemini, Meta AI from one side panel.

2/ No API keys — uses the session you’re already logged into.

3/ Free by default. 15 starter skills. Paid skills only charge when the run succeeds.

4/ github.com/shankarsai000/algogent

(Demo GIF below)
```

---

## Reddit

**r/ChatGPT / r/claudeai**

```text
Title: Open-source skill runner for ChatGPT/Claude (no API keys)

Portable skills as markdown packages; browser extension injects into the chat UI you already use. Free seed skills included (summarize, PR review, meeting notes, …). Feedback welcome on the Open Skill Format.

https://github.com/shankarsai000/algogent
```

**r/LocalLLaMA** (frame carefully — this is cloud UI automation, not local inference)

```text
Title: Open skill format + browser runner for commercial chat UIs (companion to local stacks)

Not a local model runner — packages the *skill* so the same prompt package can target ChatGPT/Claude/etc. Useful if you want one skill library across tools. MIT.
```

---

## LinkedIn (short)

```text
Shipped Algogent (MIT): portable AI skills for ChatGPT, Claude, Gemini, and Meta AI — no API keys, free by default, optional pay only on success.

Open Skill Format: manifest.json + SKILL.md

https://github.com/shankarsai000/algogent
```
