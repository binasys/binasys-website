---
name: binasys-company-context
description: Binasys company knowledge — who we are (hands-on business consulting for Malaysian SMEs: Strategy, Analytics, Implementation), key facts, glossary of internal terms, tone of voice and writing style. Use whenever writing or reviewing anything company-facing (emails, announcements, docs, website copy, reports) or when the user uses Binasys jargon or asks "what does X mean here".
---

# Binasys company context

## When to use
- Writing emails, announcements, proposals, website text, reports, slide notes
- The user uses an internal term or acronym you don't know
- "Write this in our style", "make this sound like Binasys"

## How to use the reference files
Load only what you need:
- `reference/company.md` — who we are, what we do, products/services, teams, key facts
- `reference/glossary.md` — internal terms and acronyms
- `reference/style-guide.md` — tone of voice, writing rules, formatting, words to avoid

## Rules
1. Prefer facts from the reference files over your own assumptions. If something isn't in them, say so and ask — never invent company facts, numbers, names, or client details.
2. If a detail you need (e.g. contact details, a new client) isn't in the reference files, ask the user — don't guess.
3. Never include confidential information (client names, prices, internal metrics) in content meant for the public unless the user explicitly confirms it's allowed.
4. Apply the style guide to everything you write for the user.
5. For logos, colours, favicons or visual design, also use the `binasys-brand` skill. For slides, proposals, reports, charts and tables, use `binasys-documents`.

## Tell the user
When you've applied company context, mention briefly which guidelines you followed (e.g. "Used our house style: short sentences, British spelling").

## Keeping this up to date
Changes to these files go through the `binasys-skill-authoring` skill (dev → PR → main). Owner: see `.github/CODEOWNERS` in the skills repo.
