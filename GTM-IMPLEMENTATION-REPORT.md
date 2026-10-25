# Google Tag Manager implementation report

**Project:** Pickleball Certificate Authenticator (`package.json` name: `portfolio`)
**Website:** https://pickleballcertifiedauthentic.com/
**Repository:** https://github.com/dgency/Pickleball-Certificate-Authenticator
**Report date:** 2026-10-25
**Status:** implemented and tested locally. **Not pushed, not merged, not deployed.**

---

## 1. Summary

| Item | Value |
|---|---|
| GTM container | `GTM-KMXDPND9`, the only GTM container ID in the application code and in git history up to `a5f76a0`. The other ID, `GTM-M8L5P7PK`, appears in no source file or earlier commit, only in this sentence |
| Next.js version | **14.1.0**, the same version production runs (`window.next.version` on the live site). React 18.3.1 |
| Architecture | App Router (`src/app`), one root layout (`src/app/layout.js`), no nested layouts or templates, no middleware, no Server Actions |
| Git branch | `feature/google-tag-manager-production` |
| GTM commit | `a5f76a0fe59ee631e75e8f22fcd35172ca8af456`, "feat: integrate Google Tag Manager GTM-KMXDPND9" |
| Report commit | the commit directly after `a5f76a0` on the same branch ("docs: add GTM implementation report") |
| Branch base | `e9f8b36` (`recovery/production-baseline`), the recovered production source, on top of `origin/main` `25bb2bb` |
| Files changed by GTM | `src/app/layout.js` only (+23 lines, 0 deletions) |
| Files changed by report commit | `GTM-IMPLEMENTATION-REPORT.md` (new) |
| New dependencies | none |

What a push of this branch adds on top of `origin/main`:

```
<report commit>  docs: add GTM implementation report
a5f76a0          feat: integrate Google Tag Manager GTM-KMXDPND9
e9f8b36          Restore production source from authenticator2@32e9e1c
```

---

## 2. Why this branch is based on `e9f8b36`, not `main`

The dgency `main` branch (`25bb2bb`, "transfer from shakil git to dgency git") does **not** match production. It is a copy
of `shakil-dgency/pickleball-certificate-authenticator3`, a short 8-commit repo from 2025-02-26. That repo's **final**
commit (`80a5cd6`, which `25bb2bb` copies exactly) doesn't mount the homepage hero, serial-number search or result views,
and the repo has no contact form at any commit. Earlier authenticator3 commits did mount them (`f40717f` through
`GlobalContainer`, `fc3ce24` through `<Hero />`), and the components are still in the tree, just unused. (The `e9f8b36`
commit message words this less precisely, as "never wired the verification UI into the homepage"; the code and tree are
unaffected.)

The live site is built from **`shakil-dgency/pickleball-certificate-authenticator2` @ `32e9e1c`** (2025-03-18, the HEAD of
that repo's `main`, 44 commits). Evidence:

1. **Static files:** all 35 files under `public/` at `32e9e1c` are served byte-identical by production (git blob SHA-1 of the
   downloaded bytes), and the 7 files that commit deleted return 404 on production. The previous commit and dgency `main`
   each differ on 8 files.
2. **Compiled code:** `32e9e1c` built with its own lockfile (Next 14.1.0) and production's public build values reproduces
   production's `/_next/static` output. 15 of 21 assets are byte-identical, including every shared framework chunk.
   In the homepage and contact-page chunks every webpack module body is identical; only path-derived module IDs differ.
   The remaining differences all come from the build machine: module/chunk IDs hashed from absolute paths, the `next/font`
   class hash, and Google Fonts `unicode-range` data fetched at build time.
3. **PDF:** `/api/pdf?1234567` from the recovered code is the same size as production's (1,297,601 bytes), and all 12
   decompressed PDF streams match once the random font-subset tags are normalized.

Branch `recovery/production-baseline` (`e9f8b36`) is `origin/main` plus one commit whose tree is **exactly** `32e9e1c`'s tree
(`d5313fd7`). It's based on dgency `main`, so GitHub can open a normal pull request. The GTM commit sits on top of it.

> **Blocker for a "deployment-ready" claim:** the DigitalOcean App Platform source (repository, branch, active commit) has
> **not** been checked in the DO dashboard (no DO access from this machine). The fingerprint evidence above is strong, but
> it isn't the same as reading the deployment record. See section 15.

---

## 3. Modified files

| File | Change |
|---|---|
| `src/app/layout.js` | +`GTM_ID` constant, +explicit `<head>` with the GTM `<Script>`, +noscript iframe as the first element inside `<body>` |
| `GTM-IMPLEMENTATION-REPORT.md` | new (this file, separate commit) |

Unchanged: everything else, including metadata, the Roboto font setup, `GlobalStateProvider`, `Navbar`/`Footer`, the reCAPTCHA
`<Script>`, all pages, components, API routes, `public/`, `package.json`, `package-lock.json`, `next.config.mjs` and
`.eslintrc.json`.

---

## 4. Head script implementation

```jsx
const GTM_ID = "GTM-KMXDPND9";
...
<html lang="en">
	<head>
		{/* Google Tag Manager */}
		<Script id="google-tag-manager" strategy="beforeInteractive">
			{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
		</Script>
		{/* End Google Tag Manager */}
	</head>
```

- The body is Google's standard GTM snippet, unmodified. It creates `window.dataLayer`, pushes `{'gtm.start', event:'gtm.js'}`
  and inserts an **async** `<script src="https://www.googletagmanager.com/gtm.js?id=GTM-KMXDPND9">`.
- It uses `next/script` with `strategy="beforeInteractive"` in the root layout, which is the Next.js 14 App Router way to run
  a script before hydration on every page. Next renders it into `<head>` as
  `<script>(self.__next_s=self.__next_s||[]).push([0,{"children":"…","id":"google-tag-manager"}])</script>`, and its bootstrap
  runs it **once per full page load**.
- The root layout stays mounted across client-side navigations, so the snippet is never re-run on route changes. A copy of
  the `<Script>` props also appears in the RSC hydration payload (`self.__next_f.push(...)`); that's data, not executed code.
  The runtime tests in section 9 confirm a single execution.
- The `id="google-tag-manager"` prop gives the inline script the stable ID `next/script` requires.

## 5. Noscript iframe implementation

```jsx
<body className={`${roboto.className} antialiased flex flex-col min-h-screen`}>
	{/* Google Tag Manager (noscript) */}
	<noscript>
		<iframe
			src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
			height="0"
			width="0"
			style={{ display: "none", visibility: "hidden" }}
		/>
	</noscript>
	{/* End Google Tag Manager (noscript) */}
	<GlobalStateProvider>...
```

Rendered HTML (all pages):
`<body class="…"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMXDPND9" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>…`

On Next.js 14.1.0 the GTM `<noscript>` block, which contains the iframe, is the **literal first child of `<body>`**, with no
text or element before it. With JavaScript on, browsers treat `<noscript>` content as text, so the iframe only exists for
visitors without JavaScript. (On Next 15 a hidden `<div>` that Next injects would come first. That's acceptable but doesn't
apply to this branch.) No HTML rewriting or Next.js internals were changed.

---

## 6. GTM duplicate-check results

| Check | Result |
|---|---|
| Executable GTM snippets per prerendered page (`.next/server/app/*.html`) | **1** on every page, in `<head>` |
| GTM snippets per served page (HTTP) for `/`, `/contact`, `/privacy-policy`, `/terms-of-service`, 404 | **1** each |
| Noscript iframes per page | **1** each |
| `<script src=…gtm.js>` after load (`/`) | 1 |
| `gtm.js` network requests after load | 1 |
| `dataLayer` `gtm.js` events after load | 1 (`gtm.js`, `gtm.dom`, `gtm.load`) |
| `google_tag_manager` containers | `GTM-KMXDPND9` only |
| After client-side `next/link` navigations `/` → `/contact` → `/terms-of-service` → `/privacy-policy` → `/`, then back, back, forward (no reload, verified with an in-page marker) | still 1 script tag, 1 request, 1 `gtm.js` event at every step |
| "Go Home" link from the 404 page (client-side) | still 1 / 1 / 1 |
| Full reload ("Search again" link reloads the page) | fresh page, 1 / 1 / 1 again (expected: one container per page load) |

## 7. Page coverage

| Route | Type | HTTP | GTM head snippet | Noscript iframe |
|---|---|---|---|---|
| `/` (hero, search, verified/failed results) | static | 200 | yes | yes, `<noscript>` first in body |
| `/contact` | static | 200 | yes | yes, `<noscript>` first in body |
| `/privacy-policy` | static | 200 | yes | yes, `<noscript>` first in body |
| `/terms-of-service` | static | 200 | yes | yes, `<noscript>` first in body |
| any unknown URL (`_not-found`) | static | 404 | yes | yes, `<noscript>` first in body |
| `/api/*` | JSON/PDF route handlers | n/a | not applicable (no HTML) | n/a |

GTM lives in the only root layout, so any page added later under `src/app` inherits it. The one exception is Next's
built-in **500** error page (`.next/server/pages/500.html`, shown only on an unhandled server error). It renders outside
the root layout, so it has no GTM, exactly like before this change (see section 10).

---

## 8. Build and lint results

**ESLint**
- `npm run lint` (`next lint`) fails with `Failed to load config "next/babel"`. That's **pre-existing**: production's
  `.eslintrc.json` extends `"next/babel"`, a Babel preset rather than an ESLint config, and the untouched baseline fails
  identically. Fixing it is unrelated to GTM, so this branch doesn't change it.
- To lint the real code anyway, ESLint 8.57 ran with a temporary, uncommitted config containing only
  `{"root": true, "extends": "next/core-web-vitals"}` (the rules the project intends). Result for all of `src/`:
  **0 errors, 10 warnings**. All 10 are pre-existing (5 `jsx-a11y/alt-text` in `api/pdf/route.jsx`, 2 in `components/Pdf/PdfTemplet.js`,
  2 `@next/next/no-img-element` in `IsVerifiedOk/BodyContent.jsx`, 1 `react-hooks/exhaustive-deps` in `Button/Button.js`).
  `src/app/layout.js` has **no findings** both before and after the GTM change.

**Production build** (`npm run build`, Next.js 14.1.0, clean `.next`)
- Exit code **0**, "Compiled successfully", 9/9 static pages generated. Route sizes are identical to the baseline
  (`/` 53.1 kB / 149 kB first load, `/contact` 24.4 kB / 114 kB, shared 84.4 kB).
- The build prints `⨯ ESLint: Failed to load config "next/babel"` and continues. The untouched baseline build does the same,
  so it's non-fatal and pre-existing. DigitalOcean builds of the same source (same `.eslintrc.json`, Next.js 14.1.0) should
  print it too. That's an inference, not checked against a DO build log (no DO access here); check it in the DO build log.
- `Compiler server/client unexpectedly exited … SIGTERM` lines also appear in baseline builds; they're harmless 14.1 worker
  shutdown messages.

**Build output compared with the baseline build** (both rebuilt; each reproduced its own hashes, so builds are deterministic)
- 43 of 48 `/_next/static` files are byte-identical, including every page chunk (homepage, contact, results views) and
  all framework chunks. The layout chunk has the same bytes under a new filename, and the webpack runtime changes only
  because it embeds that filename.
- **Visible server-rendered `<body>` markup of all 5 pages is identical** to the baseline once the GTM noscript is removed.
- `<head>` differs in two ways: the GTM script was added, and `app/not-found-*.js` is no longer preloaded. With an explicit
  `<head>`, Next now resolves the shared `next/image`/`next/link` modules for the 404 boundary from the already-loaded layout
  chunk instead of the not-found chunk. The 404 page was tested at runtime and renders correctly.
- One CSS rule was added: `.hidden{display:none}`. Tailwind's JIT scanner picks up the word `hidden` in the iframe's
  standard `visibility:"hidden"` style. **No element in the app uses a bare `hidden` class.** A scan of all built HTML/JS/RSC
  found none (only responsive `sm:hidden`), and `document.querySelectorAll('.hidden')` returned 0 at runtime. So it has no
  visual effect.

---

## 9. Regression test results (local production build, `next start -p 3123`)

Test data: public sample certificate `1234567` (the site's own "You can try" value) and nonexistent serial `9999999`.
Contact form fixture: `Test Fixture <test@example.com>`. The local build pointed `NEXT_PUBLIC_API_URL` at `http://localhost:3123/`,
and the local server had **no** reCAPTCHA secret or SMTP credentials, so no email could be sent. No production data was changed.

| # | Test | Result |
|---|---|---|
| 1 | ESLint | PASS (0 errors, 10 pre-existing warnings; project config bug pre-existing, see section 8) |
| 2 | Production build | PASS (exit 0) |
| 3 | GTM HTML injection, all public pages | PASS |
| 4 | GTM duplicate injection (load + client nav + history) | PASS (always exactly 1) |
| 5 | Public route coverage (4 pages + 404) | PASS |
| 6a | `GET /api/certificates/1234567` | PASS: 200, 732 B, **byte-identical to production's response** |
| 6b | `GET /api/certificates/9999999` | PASS: 404 `{"error":"Failed to fetch certificate"}`, byte-identical to production |
| 7a | `GET /api/pdf?1234567` | PASS: 200, `%PDF-1.3`, 1,297,601 B; all 12 PDF streams identical to production's PDF after normalizing random font-subset tags |
| 7b | `GET /api/pdf?9999999` | PASS: 404 JSON |
| 7c | PDF download through the UI ("Download" button on the verified view) | PASS: prefetch `/api/pdf?1234567` 200, blob `%PDF-1.3` 1,297,601 B, download named `pickleballcertified-authentic-1234567.pdf` (save intercepted in-page, no file written) |
| 8 | Valid search (`1234567`) in the hero | PASS: "Signature Verified", serial shown, all 6 fields (Item Description, Match Used, Match Details, Item Details, Date Signed, Signed By), Lottie animations, cert API 200 |
| 9 | Invalid search (`9999999`) | PASS: "Signature verification failed", serial shown, alert Lottie, new search box, cert API 404 |
| 10 | "Search again" link | PASS: full reload back to the hero; GTM loaded once on the new page |
| 11 | reCAPTCHA v3 with GTM present (**client side**) | PASS: `api.js?render=<site key>` still loaded (1 tag), `grecaptcha.execute` ready on every page, a token request (`recaptcha/api2/clr`) made on submit. Server-side verification (Google `siteverify`) was not exercised (no secret locally) |
| 12 | Contact form submit (client-side nav from footer) | PASS **client side**, same as baseline: form renders with 5 required fields, token obtained, POST sent to `//api/send-contact-info`. The local server stopped at `No secret key found` (HTTP 500), as intended, so no email was attempted. Server-side token verification and email delivery were **not** exercised |
| 13 | 404 page | PASS: "Oops! sorry page does not found…" with 404 artwork, "Go Home" link works (client-side) |
| 14 | Browser console, fresh tab per route | PASS: `/`, `/contact`, `/privacy-policy`, `/terms-of-service` have **no console messages**; 404 page logs only its own expected `404 (Not Found)` document status |
| 15 | Responsive (375×812 mobile) homepage | PASS: hero + search visible, no horizontal overflow, GTM once, no errors |
| 16 | GSAP | PASS: download-button animation ran during test 7c |
| 17 | Baseline behaviors compared | the same flows were run on the baseline (no GTM) earlier, with identical outcomes |

---

## 10. Known issues and limitations

**Blocking deployment confirmation**
1. **DigitalOcean source not verified.** The active App Platform source (repo, branch, deployed commit) must be read from the
   DO dashboard before calling this deployment-ready. The expected answer is `shakil-dgency/pickleball-certificate-authenticator2`,
   `main`, `32e9e1c`. If it's anything else, stop and re-check.
2. **DO is most likely deploying from the shakil-dgency repo**, not dgency. Pushing this branch to dgency won't change the
   live site until DO's source is pointed at the dgency repo (section 16).

**Not verifiable before deployment**
3. Live GTM verification (Tag Assistant, real domain, Cloudflare caching) can only happen after deployment (section 17).
4. Container `GTM-KMXDPND9` (published version 1) currently contains **no tags**: no GA4/Ads measurement ID, only built-in
   variables. GTM will load, but **no analytics page views are recorded until tags are added in GTM**. GTM installation and
   GA4 configuration are separate. Don't add a GA4 "page_view on History Change" tag and GA4 enhanced-measurement
   "page changes based on browser history" at the same time, or SPA page views will double count.

**Pre-existing, unchanged by this branch (inherited from production)**
5. `.eslintrc.json` extends `"next/babel"`, so `next lint` fails and the build prints an ESLint error (non-fatal).
6. Next.js 14.1.0 is affected by published Next.js security advisories, and Next 14 no longer gets security patches. An upgrade
   path is prepared separately (`chore/upgrade-next-15.5`, which still has to be rebased onto the recovered source) and is
   intentionally **not** part of this branch.
7. The contact form shows its success animation even when sending fails, and the visitor's input goes into the
   notification email's HTML unescaped.
8. `POST /api/send-contact-info` without a token returns a plain object instead of a `Response`, so Next answers 500.
9. Production's `NEXT_PUBLIC_API_URL` ends with `/`, so the form posts to `https://pickleballcertifiedauthentic.com//api/send-contact-info` (works today).
10. Site metadata description is still "Generated by create next app".

**Side effects of the GTM change (reviewed, no functional impact)**
11. Tailwind adds an unused `.hidden{display:none}` rule (section 8).
12. The 404 boundary's chunk is no longer preloaded on normal pages; it's covered by the layout chunk (section 8).
13. GTM loads before any consent banner (the site has none). If consent is ever required, configure Consent Mode in GTM.
14. There is no Content-Security-Policy today. If one is added later it must allow `www.googletagmanager.com` (and the tags' domains).
15. Next's built-in 500 error page has no GTM (section 7). Covering it would mean adding a custom `src/app/global-error.js`,
    which is new code outside this change.

---

## 11. Repository-to-production compatibility status

| Question | Status |
|---|---|
| Is the production source code identified? | **Yes, by artifact fingerprint**: `shakil-dgency/pickleball-certificate-authenticator2@32e9e1c` |
| Is it recovered into the dgency repo? | **Yes, locally**: `recovery/production-baseline` `e9f8b36` (tree identical to `32e9e1c`). Not pushed |
| Does dgency `main` match production? | **No.** `main` (`25bb2bb`) is the authenticator3 copy and lacks the hero/search, results views and contact form |
| Is the GTM branch built on the production source? | **Yes**: `feature/google-tag-manager-production` = `e9f8b36` + GTM + report |
| Is the DO deployment source confirmed? | **No, pending your check in the DO dashboard** |

---

## 12. Manual GitHub push instructions (run only after review)

Run these from the main checkout (all worktrees share the same branches):

```bash
cd "F:/All Project/certificate.thepickleballscoreboard.com (pickleballcertifiedauthentic.com)/Pickleball-Certificate-Authenticator"
git fetch origin
git log --oneline origin/main..feature/google-tag-manager-production
git push -u origin feature/google-tag-manager-production
```

The `git log` should list exactly 3 commits: the report commit, `a5f76a0` and `e9f8b36`. Optionally, to keep the
production-only baseline as its own branch (handy for rollback and for rebasing the Next.js upgrade later):

```bash
git push -u origin recovery/production-baseline
```

Then open a pull request **into `main`** for review (don't merge until the DO check in section 10 is done). The main
checkout has `feature/google-tag-manager` checked out, so this report isn't in its working tree. The command below reads
the PR body straight from the committed copy on the branch:

```bash
git show feature/google-tag-manager-production:GTM-IMPLEMENTATION-REPORT.md | gh pr create --repo dgency/Pickleball-Certificate-Authenticator --base main --head feature/google-tag-manager-production --title "Restore production source and add Google Tag Manager (GTM-KMXDPND9)" --body-file -
```

Notes:
- The local remotes `shakil1/2/3` have their push URLs set to `DISABLED_NO_PUSH`, so nothing can be pushed to the
  shakil-dgency repos by mistake.
- Don't push `feature/google-tag-manager` (`520342f`). It sits on the old, non-production `main` and would remove the hero,
  search and contact form if deployed.

## 13. Manual DigitalOcean deployment instructions

Prerequisite: section 10, item 1 (confirm DO's current source).

Important: in App Platform, **saving any change to the production app's source, components, spec or env vars starts a
production deployment right away.** Do all the checks before you save anything.

1. **Record the current state for rollback (read only).** In DO App Platform → app `863eab37-a750-4e9f-8439-a7142781cffa` →
   *Activity*, note the active deployment ID and commit. Under *Settings → App Spec*, download the current spec. From it,
   record the web service's `github.repo`, `branch` and `deploy_on_push`, its `build_command` and `run_command` (if they're
   missing, the Node.js buildpack defaults `npm run build` / `npm start` apply), and the names and scopes, but not the values,
   of its env vars.
2. **Check environment variables before changing anything. GTM needs no new ones.** Confirm the spec from step 1 has
   `BASE_URL`, `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_CAPTCHA_SITE_KEY` (the two `NEXT_PUBLIC_*` must be available at **build**
   time), plus `CAPTCHA_SECRET_KEY`, `EMAIL_HOST`, `EMAIL_USER` and `EMAIL_PASSWORD`. Don't print or copy their values.
3. **Optional test run first, in a separate app.** Create a separate, throwaway DO app from branch
   `feature/google-tag-manager-production` with its own env vars. Set `NEXT_PUBLIC_API_URL` and `BASE_URL` to that test
   app's own URL, or its contact form will post to the production API. Don't add a "staging" component to the production
   app: that changes its spec (redeploying the live site), and it wouldn't work on a sub-path because the app has no `basePath`.
4. **Change the source (this starts the production deploy).** Recommended: after the PR is reviewed and merged into dgency
   `main`, go to *Settings → Components → (web service) → Source*, set the GitHub repo to `dgency/Pickleball-Certificate-Authenticator`
   and the branch to `main`, and keep the build and run commands recorded in step 1. You may need to authorize the
   DigitalOcean GitHub app for the dgency account first. Saving starts the deployment.
5. Watch the build log. Expect `Next.js 14.1.0`, probably the known non-fatal `ESLint: Failed to load config "next/babel"`
   line, and "Generating static pages (9/9)".
6. **Rollback:** *Activity* → previous deployment → *Rollback*, or switch the source back to the repo and branch recorded in step 1.
7. Purge the Cloudflare/DO CDN cache for HTML if pages still show the old markup (the homepage HTML is edge-cached with
   `s-maxage=31536000`).

## 14. Post-deployment Tag Assistant verification

1. Open https://pickleballcertifiedauthentic.com/ → *View source* → confirm one `GTM-KMXDPND9` snippet in `<head>`
   (inside `self.__next_s.push(...)`) and the `ns.html?id=GTM-KMXDPND9` noscript right after `<body>`.
2. DevTools → *Network* → filter `gtm.js`: exactly **one** request `gtm.js?id=GTM-KMXDPND9`, status 200.
3. DevTools → *Console*: `dataLayer.filter(e => e.event === 'gtm.js').length` → `1`, and
   `Object.keys(google_tag_manager)` includes `GTM-KMXDPND9`.
4. Go to https://tagassistant.google.com/ → *Add domain* → `https://pickleballcertifiedauthentic.com/` → *Connect*. In the
   Tag Assistant panel, container **GTM-KMXDPND9** should show *Connected* with the events *Container Loaded*, *DOM Ready*
   and *Window Loaded* once.
5. While connected, click footer links (Contact, Terms, Privacy) and the logo. **No second *Container Loaded*** should appear.
   The current container (version 1) has no triggers, so GTM installs no history listener and you'll most likely see **no**
   *History Change* events either. That's expected. They only appear after a History Change trigger, or a GA4 tag with
   "page changes based on browser history events", is added to the container.
6. In GTM (tagmanager.google.com) → *Preview* gives the same view. Remember the container has no tags yet (section 10, item 4).
7. Repeat steps 1–3 on `/contact` and on a nonexistent URL (404 page).
8. Search `1234567` and download the PDF on the live site to confirm the core flows after deployment.

---

## 15. Final status

### Completed and verified (locally)
- Production source identified by fingerprint and recovered as `recovery/production-baseline` (`e9f8b36`, tree = `32e9e1c`).
- GTM implemented on top of it (`a5f76a0`, `src/app/layout.js` only).
- GTM head snippet and noscript iframe present exactly once on every public page; no duplicates across client navigation and history.
- Production build passes; ESLint shows 0 errors on the code; visible markup of all pages unchanged.
- Certificate API, PDF generation and download, valid/invalid search, 404 page, console and mobile layout all pass. The
  certificate API responses are byte-identical to production's, and the PDF matches production's once the random
  font-subset tags are normalized.
- reCAPTCHA and the contact form pass **on the client side** and behave the same as the local baseline: `api.js` loads once,
  a token is obtained on submit, and the POST is sent.

### Completed but not verified
- Live behavior on pickleballcertifiedauthentic.com (needs deployment): Tag Assistant connection, real-domain reCAPTCHA
  scoring, Cloudflare caching of the new HTML.
- Contact form end to end: server-side reCAPTCHA verification (`siteverify`) and email delivery. Both were deliberately
  not exercised; the local server had no `CAPTCHA_SECRET_KEY` or SMTP credentials. The GTM change doesn't touch either path.
- That the DO build prints the same non-fatal ESLint line (inferred from the local build; check the DO build log).

### Blocked
- **Deployment readiness**: DigitalOcean's active source repository, branch and commit are not confirmed (no DO access here).

### Remaining manual steps
1. Check the DO dashboard (section 10, item 1).
2. Review this branch; push it (section 12) and open the PR.
3. Point DO at the reviewed code and deploy (section 13).
4. Verify with Tag Assistant (section 14).
5. Optionally, add tags (for example GA4) in the GTM container. That's a separate change.

### Deployment readiness verdict
**Code: ready for review. Deployment: not yet confirmed.** The branch contains only the recovered production source plus
the GTM change, and every local check passed. Don't deploy it until the DigitalOcean source is confirmed and the PR has been
reviewed.
