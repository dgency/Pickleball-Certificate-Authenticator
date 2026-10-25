# Project report: production recovery, GTM, Next.js 15 upgrade, security and contact-form fixes

**Project:** Pickleball Certificate Authenticator
**Website:** https://pickleballcertifiedauthentic.com/ (DigitalOcean App Platform, App `863eab37-a750-4e9f-8439-a7142781cffa`, behind Cloudflare)
**Repository:** https://github.com/dgency/Pickleball-Certificate-Authenticator
**Branch (all work):** `feature/google-tag-manager-production`
**Date:** 2026-10-25
**State:** all work committed locally on one branch. **Not pushed, not merged, not deployed.**
GTM-specific details are in [`GTM-IMPLEMENTATION-REPORT.md`](GTM-IMPLEMENTATION-REPORT.md).

---

## 1. Commits on the branch (oldest first, on top of `origin/main` `25bb2bb`)

| Commit | Purpose |
|---|---|
| `e9f8b36` | Restore production source: tree identical to `shakil-dgency/pickleball-certificate-authenticator2@32e9e1c`, the code the live site is built from |
| `a5f76a0` | feat: integrate Google Tag Manager GTM-KMXDPND9 |
| `d28fba5` | docs: add GTM implementation report (first version) |
| `a6cc224` | Upgrade to Next.js 15.5.28 and React 19.3.1 |
| `06b94df` | Fix ESLint config so lint runs |
| `06abbd0` | Patch vulnerable dependencies and remove unused PDF libraries |
| `057be59` | Fix contact form reporting success when sending fails |
| *(last)* | docs: update reports (this file and the GTM report) |

`recovery/production-baseline` (`e9f8b36`) is kept as a separate, untouched branch for reference and rollback. Older
local branches (`feature/google-tag-manager`, `chore/upgrade-next-14.2.35`, `chore/upgrade-next-15.5`) are preserved but
superseded. Don't push them.

## 2. Changed files (vs the recovered production baseline `e9f8b36`)

| File | Change |
|---|---|
| `src/app/layout.js` | GTM head script (`next/script`, `beforeInteractive`) + noscript iframe |
| `next.config.mjs` | `experimental.serverComponentsExternalPackages` became top-level `serverExternalPackages` (Next 15) |
| `src/app/api/certificates/[id]/route.js` | `await params` (Next 15 async route params) |
| `src/app/api/pdf/route.jsx` | Strip the trailing `=` Next 15 adds to a bare query (`?1234567` → `?1234567=`). Without it every PDF download 404s. Production's MM/DD/YYYY date formatting is unchanged |
| `src/app/api/send-contact-info/route.js` | Missing token → 400 JSON (was a crash/500); failed reCAPTCHA → 403 |
| `src/server/utils/captcha.js` | `verifyCaptchaToken` now returns Google's verdict (`success === true`); it used to ignore it |
| `src/server/services/EmailService.js` | Restored missing `sendError` import; HTML-escape visitor input in the email; strip line breaks from the subject |
| `src/components/Contact/ContactForm.jsx` | Success only after the API confirms delivery; inline error on failure; duplicate-submit guard; same look and animations |
| `.eslintrc.json` | `{"root": true, "extends": "next/core-web-vitals"}` (was the invalid `next/babel` preset) |
| `package.json`, `package-lock.json` | Framework and dependency changes below; `engines.node`; lockfile stays v2 |
| `GTM-IMPLEMENTATION-REPORT.md`, `PROJECT-REPORT.md` | Documentation |

No other source, asset or configuration file changed. Homepage, search, result views, PDF layout, GSAP and Lottie
animations, styles and metadata are untouched.

## 3. Framework and dependency versions

| Package | Production today (`32e9e1c`) | This branch | Note |
|---|---|---|---|
| next | 14.1.0 | **15.5.28** | latest 15.5.x, 0 published advisories |
| react / react-dom | 18.3.1 | **19.3.1** | 0 advisories |
| eslint-config-next | 14.1.0 | 15.5.28 | |
| @types/react | 18.3.12 | 19.3.0 | |
| lottie-react | 2.4.0 | 2.4.2 | first 2.x that allows React 19 as a peer |
| sharp | not installed (squoosh fallback) | **0.35.5** | optional dependency of Next 15; this is the release that fixes GHSA-2464-fhr4-w9xw |
| axios | 1.7.7 | 1.20.0 | same major |
| nodemailer | 6.9.15 | **10.2.1** | major upgrade, see section 4 |
| postcss (dev) | 8.4.47 | 8.5.31 | |
| jspdf, html2canvas | 2.5.2, 1.4.1 | **removed** | not imported anywhere, in this branch or in production `32e9e1c` |
| @react-pdf/renderer, gsap, react-typed, react-icons, react-google-recaptcha, tailwindcss, eslint | unchanged | unchanged | |
| Node.js | DO default | `engines.node: "22.x \|\| 24.x"` | nodemailer 10 needs ≥ 20, Next 15.5 needs ≥ 18.18; tested locally on Node 24.8 |

Every React library was checked for React 19 compatibility: peer ranges, and no use of APIs React 19 removed
(`findDOMNode`, string refs, legacy context, `ReactDOM.render`).

## 4. Security audit

**Before / after (`npm audit`)**

| | critical | high | moderate | total |
|---|---|---|---|---|
| Production today (`32e9e1c` lockfile) | 3 (`next`, `jspdf`, `form-data`) | 19 | 6 | **28** |
| After the framework upgrade only | 2 | 15 | 7 | 24 |
| **This branch (final)** | **0** | **1** | **4** | **5** |

Plus the Next.js advisories themselves: production's 14.1.0 is affected by published Next.js advisories that have no
14.x fix (Next 14 is out of support). **15.5.28 has none.** `react@19.3.1`, `react-dom@19.3.1` and `sharp@0.35.5` also have none.

**What was fixed, and whether it applied in production**

| Package | Fix | Exploitable in production? |
|---|---|---|
| next 14.1.0 → 15.5.28 | upgrade | **Yes:** image-optimizer and RSC cache-poisoning advisories apply to a self-hosted app behind a caching CDN |
| nodemailer → 10.2.1 | major upgrade | **Yes:** the contact route passes visitor input to it (`replyTo`, subject, body). Addressparser DoS/misparse, header and CRLF injection. Breaking changes (SES, error code names, TLS for remote attachments, Node ≥ 20) don't affect this app's SMTP usage, which was verified offline |
| axios → 1.20.0 | minor | Low: it's only used in the browser for one same-origin POST, but it shipped in the client bundle |
| form-data, follow-redirects | via axios | as above |
| jspdf (critical), dompurify, canvg, fflate | **removed** with jspdf/html2canvas | No: they were never imported, but shipped in `node_modules` |
| brace-expansion, minimatch, glob, cross-spawn, js-yaml, flatted, picomatch, nanoid, source-map-js, browserslist, yaml, ajv, @babel/runtime | `npm audit fix` (no `--force`) / `npm update` | No: build/dev tooling |
| Email HTML injection (app code) | escape visitor input | **Yes:** visitor input was inserted into the owner's email unescaped |
| reCAPTCHA not enforced (app code) | check `success` | **Yes:** bots could bypass reCAPTCHA entirely |

**Remaining (5), all build-time only and not reachable by visitors**

| Advisory path | Why it remains | Risk |
|---|---|---|
| `postcss@8.4.31` pinned exactly by `next@15.5.28` (reported as `postcss` high + `next` moderate) | the only fix is Next 16 (major) | needs attacker-controlled CSS or source maps at build time; the build processes only the project's own CSS |
| `postcss-selector-parser@6` via `tailwindcss@3` (reported as `postcss-selector-parser`, `postcss-nested`, `tailwindcss` moderate) | the only fix is Tailwind 4 (major rewrite) | same: the project's own CSS, at build time |

Secrets were not read, printed or changed. Local tests used no production secrets.

## 5. ESLint

`.eslintrc.json` extended `"next/babel"`, a Babel preset, so `next lint` failed outright and `next build` skipped linting.
It now extends `next/core-web-vitals` and is marked `root`.

- `npm run lint` → **0 errors, 10 warnings**, all pre-existing and none suppressed: 7 `jsx-a11y/alt-text` on `@react-pdf`'s
  PDF `<Image>` (a false positive, since it isn't an HTML image), 2 `@next/next/no-img-element` (production deliberately
  switched those to `<img>` in commit `e59cace`), 1 `react-hooks/exhaustive-deps` in `Button.js` (changing it would alter
  when the PDF is prefetched).
- `next build` now runs lint as well, with 0 errors.
- Note: Next.js prints that `next lint` is deprecated and will be removed in Next 16. It works on 15.x. Migrating to the
  ESLint CLI is a Next 16 task.

## 6. Contact form fix

**Bugs fixed:**
- The success animation was scheduled before the request was sent, so it always showed, even when sending failed.
- Errors were only logged to the console.
- Repeated clicks sent duplicates.
- A missing token crashed the route (500).
- reCAPTCHA verification was ignored.
- A send failure threw a ReferenceError (missing import).
- Visitor HTML went unescaped into the email.

**Now:**
- The button shows the same sending animation.
- "Success!!" appears only when the API returns `success: true`. The form is then cleared.
- On any failure (no token, network, 4xx/5xx), the red message "Sorry, your message could not be sent. Please try again
  later." appears under the button, and the visitor's input is kept.
- The button is disabled while sending, and a ref guard blocks double submits.
- The server returns 400 for a missing token and 403 for a failed reCAPTCHA check.

**Behavior change to check after deployment:** reCAPTCHA is now actually enforced. If the production `CAPTCHA_SECRET_KEY`
doesn't match the site key, or the site's domain isn't allowed for that key, submissions that "succeeded" before will now
show the error message. Send one authorized test message right after deploying (section 9).

## 7. Build and lint results (final tree)

- `npm ci` from lockfile v2: OK. `npm ls react react-dom`: no invalid peers.
- `npm run lint`: exit 0, 0 errors, 10 warnings (section 5).
- `npm run build` (Next.js 15.5.28): exit 0, lint runs, 9/9 static pages. `/` 53.1 kB (165 kB first load), `/contact` 22.4 kB (131 kB first load),
  shared JS 103 kB (production on 14.1: 84 kB shared; the increase is the React 19 + Next 15 runtime).
- Local note only: in this git worktree, Next warns about "multiple lockfiles / workspace root" because the worktree sits
  inside another checkout. A normal clone (and DigitalOcean) has one lockfile and won't show it.

## 8. Regression tests (local production build, `next start`, final tree)

Fixtures: public sample certificate `1234567` (the site's own "You can try" value), nonexistent `9999999`, contact
fixture `Test Fixture <test@example.com>`. No certificate data was modified. **No real email was sent:** the success
path used Google's published reCAPTCHA *test* secret plus a local SMTP sink that stores messages without relaying them.

**HTTP level: this branch compared with the live production site**

| Check | Result |
|---|---|
| `/`, `/contact`, `/privacy-policy`, `/terms-of-service` → 200; unknown URL → 404 | PASS, same as production |
| Metadata on every page (`lang`, charset, viewport, title, description, favicon) | PASS, **identical to production** |
| Rendered `<body>` structure (every tag, class and text node) on all 5 pages | PASS, **identical to production** (after decoding Cloudflare's e-mail obfuscation on the live pages and removing GTM's noscript and Next 15's hidden metadata `<div>`) |
| `GET /api/certificates/1234567`, `/9999999` | PASS, 200/404, **byte-identical to production** |
| `GET /api/pdf?1234567` | PASS, 200, 1,297,601 B, all 12 PDF streams identical to production's PDF (random font-subset tags normalized) |
| `GET /api/pdf?9999999` | PASS, 404 JSON |

**Browser**

| Check | Result |
|---|---|
| Homepage + hero, react-typed placeholder animation, 4 Lottie animations | PASS |
| Valid search `1234567` → "Signature Verified", serial, 6 fields, date `12/21/2024`, 2 Lottie checks | PASS |
| PDF download button: prefetch 200, `%PDF-1.3` blob 1,297,601 B, file `pickleballcertified-authentic-1234567.pdf` (save intercepted), GSAP button animation runs | PASS |
| Invalid search `9999999` → "Signature verification failed", alert Lottie, new search box | PASS |
| "Search again" (full reload back to the hero) | PASS |
| 404 page + "Go Home" | PASS |
| Navigation: footer/nav links, back/forward, client-side without reload | PASS |
| Contact failure path (no secret): error message shown, success **never** shown, input kept, double-click → 1 POST | PASS |
| Contact success path (test secret + local SMTP sink): triple-click → 1 POST (200), success shown only after the response, form cleared, email captured with correct headers and **escaped HTML** | PASS |
| Contact reCAPTCHA rejection (invalid secret): API 403, no email | PASS |
| Contact missing token: API 400 JSON | PASS |
| reCAPTCHA client: `api.js` loaded once, `grecaptcha.execute` ready, token issued on submit | PASS |
| GTM: one container, one `gtm.js` request, one `gtm.js` event per page load; no duplicates across 4 client navigations + back/forward | PASS (details in the GTM report) |
| Console, fresh tab per route | PASS: no messages on `/`, `/contact`, `/privacy-policy`, `/terms-of-service`; 404 page logs only its own 404 |
| Mobile 375×812: homepage and contact form, no horizontal overflow | PASS |

**Not testable locally:** real-domain reCAPTCHA scoring with the production secret, real email delivery through
production SMTP, Tag Assistant on the live domain, and Cloudflare caching of the new HTML.

## 9. DigitalOcean compatibility

| Topic | Status |
|---|---|
| Build / run | Standard `npm ci` → `npm run build` → `npm start` (`next start` honors `PORT`). No app spec or Dockerfile in the repo. The existing component settings should keep working |
| Node.js | `engines.node: "22.x \|\| 24.x"` makes DO's Node buildpack pick a supported LTS release. Check the version line in the first build log |
| sharp | Linux x64 binaries (`@img/sharp-linux-x64`, libvips 1.3.4) are in the lockfile; DO's glibc-based stack is supported. Image optimization now uses sharp instead of Next 14's squoosh fallback (faster; somewhat more native memory) |
| Env vars | **No new variables.** Keep `BASE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CAPTCHA_SITE_KEY` (both `NEXT_PUBLIC_*` must be available at **build** time), `CAPTCHA_SECRET_KEY`, `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD` |
| Lint during build | Now actually runs; 0 errors, so it won't fail the build |
| **Source (blocker)** | DO's active source repo/branch/commit has **not** been verified (no DO access from here). Evidence says it's `shakil-dgency/pickleball-certificate-authenticator2`, `main`, `32e9e1c` |

## 10. Manual GitHub push (only after review)

Run these from the main checkout:

```bash
cd "F:/All Project/certificate.thepickleballscoreboard.com (pickleballcertifiedauthentic.com)/Pickleball-Certificate-Authenticator"
git fetch origin
git log --oneline origin/main..feature/google-tag-manager-production
git push -u origin feature/google-tag-manager-production
```

The `git log` should list the 8 commits from section 1. Open the PR. The main checkout has a different branch checked
out, so read the body from the branch:

```bash
git show feature/google-tag-manager-production:PROJECT-REPORT.md | gh pr create --repo dgency/Pickleball-Certificate-Authenticator --base main --head feature/google-tag-manager-production --title "Restore production source, add GTM, upgrade to Next.js 15.5 / React 19, security and contact-form fixes" --body-file -
```

Optional: `git push -u origin recovery/production-baseline` keeps an exact copy of production's code on GitHub.
Don't push `feature/google-tag-manager`, `chore/upgrade-next-14.2.35` or `chore/upgrade-next-15.5`. They're built on the
wrong (non-production) `main`. The local `shakil1/2/3` remotes are read-only (push URL `DISABLED_NO_PUSH`).

## 11. Safe DigitalOcean deployment sequence

In App Platform, **saving any change to the production app (source, components, spec, env vars) starts a production
deployment immediately.** Do every read-only step first.

1. **Verify the current source (read only).** App `863eab37-…` → *Activity*: note the active deployment ID and commit
   (expected `32e9e1c`). *Settings → App Spec*: download it and note `github.repo`, `branch`, `deploy_on_push`,
   `build_command`, `run_command`, and the env var **names** and scopes. If the source isn't
   `shakil-dgency/pickleball-certificate-authenticator2` / `main` / `32e9e1c`, stop and re-check before going further.
2. **Review and push** (section 10). Merge the PR into dgency `main` only after review.
3. **Recommended: test in a separate, throwaway DO app** (never add components to the production app). Create it from
   `dgency/Pickleball-Certificate-Authenticator`, branch `feature/google-tag-manager-production`, with its own env vars:
   - `BASE_URL` and `NEXT_PUBLIC_API_URL`: the test app's own URL.
   - `NEXT_PUBLIC_CAPTCHA_SITE_KEY` / `CAPTCHA_SECRET_KEY`: the same keys work only if the test domain is added to the
     reCAPTCHA key's allowed domains. Otherwise expect the contact form to show its error message.
   - `EMAIL_*`: leave unset (contact sends will fail with the error message, as designed), or use a test SMTP inbox.
   Check pages, search, PDF and GTM there. Delete the test app afterwards.
4. **Switch production** (this deploys): *Settings → Components → (web service) → Source* → repo
   `dgency/Pickleball-Certificate-Authenticator`, branch `main`, same build/run commands as recorded in step 1. Authorize
   the DigitalOcean GitHub app for the dgency account if asked.
5. **Watch the build log:** Node 22/24, `Next.js 15.5.28`, lint with 0 errors, 9/9 static pages.
6. **Post-deploy checks (within minutes):**
   - Purge the Cloudflare/DO CDN cache for HTML (the homepage is edge-cached with `s-maxage=31536000`).
   - Homepage, search `1234567`, PDF download, an invalid serial, `/contact`, `/privacy-policy`, `/terms-of-service`, a 404 URL.
   - Send **one authorized test message** through the contact form and confirm it arrives. This checks the now-enforced
     reCAPTCHA and the nodemailer upgrade against the real secret and SMTP server. If it shows the error, check
     `CAPTCHA_SECRET_KEY` and the reCAPTCHA key's allowed domains first.
   - GTM checks with Tag Assistant (GTM report, section 14).

## 12. Rollback procedure

- **Fast:** App Platform → *Activity* → the previous (pre-switch) deployment → *Rollback*. That redeploys the last
  known-good build. Then open *Settings* and confirm or adjust the source, because the component may still point at the
  dgency repo and the next push would redeploy it.
- **Full:** set *Settings → Components → Source* back to the repo/branch recorded in step 1 (expected
  `shakil-dgency/pickleball-certificate-authenticator2` / `main`). This redeploys production's original code.
- **Code-level:** `recovery/production-baseline` (`e9f8b36`) is byte-identical to production's code. Deploying it gives
  the exact current production behavior, and adding `a5f76a0` on top gives production + GTM only.
- Purge the CDN HTML cache after any rollback.

## 13. Remaining risks and open items

1. **Blocker:** DO's active source not yet verified (section 11, step 1).
2. **reCAPTCHA is now enforced.** A misconfigured production secret would now surface as a visible contact-form error
   (before, it was silently bypassed). Verify right after deployment.
3. **Big framework jump** (Next 14.1 → 15.5, React 18 → 19). Everything the app does was regression-tested locally
   against production, but real-traffic behavior (CDN, edge caching, image optimizer under load with sharp) shows only
   after deployment.
4. 5 build-time-only audit findings remain (section 4); fixing them needs Next 16 / Tailwind 4.
5. Pre-existing, unchanged:
   - The metadata description is still "Generated by create next app" (SEO).
   - `NEXT_PUBLIC_API_URL` has a trailing slash, so posts go to `//api/send-contact-info` (works).
   - Next's built-in 500 page has no GTM.
   - `next lint` must be migrated to the ESLint CLI before Next 16.
6. The GTM container currently has no tags, so no analytics data is collected until tags are added in GTM.
