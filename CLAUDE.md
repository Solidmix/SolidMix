# SolidMix Website — Project Rules

SolidMix RMC is a ready-mix concrete (RMC) company in Raipur, Chhattisgarh (plant at Serikhedi, near Rawabhata). We are building an improved REPLICA of the current WordPress site (https://solidmixrmc.com/), page by page, with the same look and all the same information; fixing broken (404) pages and duplicate URLs with redirects; making it fully mobile responsive with a better mobile experience; SEO friendly and AEO (AI answer engine) friendly; and adding a "your area" dropdown to the Contact Us form.

IMPORTANT: the replica does NOT replace the original site. It is deployed on its own Vercel URL for review. The original WordPress site is never modified. Moving the replica to the solidmixrmc.com domain will be decided later, only after Ma'am's approval.

## Spec-driven development (obra/superpowers)
- HARD-GATE: no code until a design is approved by Saidul and saved as `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`.
- Workflow: audit first, then spec, then plan, then build in small batches.
- One branch per batch; never work on `main` directly (except this first setup commit).
- Merge only with approval, using `--no-ff`.

## Collaboration rules
- ASK-BEFORE-EDIT: confirm before editing files.
- LEDGER-COMPLETE: keep `.superpowers/sdd/progress.md` up to date.
- NO-REDO: read `current-state.md` first before starting work.
- NO-UNREQUESTED-WORK: do only what is asked.
- DUPLICATE-CHECK: check for existing work before creating new files.

## Git safety
- Never `git add -A` or `git add .`.
- No force-push, rebase, amend, reset or stash.
- Git identity is LOCAL to this repo (Solidmix / solidmixrmc2026@gmail.com). Never change the global git config.

## Original site
- The original site https://solidmixrmc.com/ is READ-ONLY reference: never log in to it, never submit its forms, never change it.

## Secrets
- Never print or commit secrets, passwords, tokens or `.env` content.

## Agents
- office-backend-agent: git, config, data, commits, pushes.
- office-frontend-agent: pages and UI.
- office-tester-agent: read-only audits and tests.

## Quality gates
- Mobile first (375px); no horizontal scroll.
- Every page compared with the original (no missing information).
- No broken links (no 404; old URL paths keep working or 301-redirect).
- SEO: unique titles, meta descriptions, one H1, alt text, canonical, sitemap.xml, robots.txt, structured data (LocalBusiness, Product, FAQPage, BreadcrumbList).
- AEO: clear Q&A content, FAQ structured data, llms.txt.
- While on the Vercel review URL the site must be `noindex`, so it does not compete with the original in Google; indexing is switched on only when the domain migration is approved.
