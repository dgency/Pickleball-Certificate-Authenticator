# Google Tag Manager implementation report

**Project:** Pickleball Certificate Authenticator (`package.json` name: `portfolio`)
**Website:** https://pickleballcertifiedauthentic.com/
**Repository:** https://github.com/dgency/Pickleball-Certificate-Authenticator
**Report date:** 2026-10-25 (updated after the Next.js 15.5 upgrade on the same branch)
**Status:** implemented and tested locally. **Not pushed, not merged, not deployed.**
Upgrade, security, contact-form, deployment and rollback details are in [`PROJECT-REPORT.md`](PROJECT-REPORT.md).

---

## 1. Summary

| Item | Value |
|---|---|
| GTM container | `GTM-KMXDPND9`, the only GTM container ID in the application code. The other ID, `GTM-M8L5P7PK`, appears in no source file, only in this sentence |
| Next.js version | **15.5.28** (React 19.3.1) on this branch. Production currently runs 14.1.0. GTM was first verified on 14.1.0 and re-verified on 15.5.28 |
| Architecture | App Router (`src/app`), one root layout (`src/app/layout.js`), no nested layouts or templates, no middleware, no Server Actions |
| Git branch | `feature/google-tag-manager-production` (all work lives on this one branch) |
| GTM commit | `a5f76a0fe59ee631e75e8f22fcd35172ca8af456`, "feat: integrate Google Tag Manager GTM-KMXDPND9" |
| Branch base | `e9f8b36`, the recovered production source (tree identical to `shakil-dgency/pickleball-certificate-authenticator2@32e9e1c`) on top of `origin/main` `25bb2bb` |
| Files changed by the GTM commit | `src/app/layout.js` only (+23 lines) |
| New dependencies for GTM | none |

## 2. Why the branch is based on `e9f8b36`, not `main`

The dgency `main` branch (`25bb2bb`) is a copy of `shakil-dgency/pickleball-certificate-authenticator3`. That repo's
**final** commit (`80a5cd6`, which `25bb2bb` copies exactly) doesn't mount the homepage hero, serial-number search or
result views, and the repo never had a contact form. (Earlier authenticator3 commits did mount the hero; the components
are still in the tree, just unused.)

The live site is built from **`shakil-dgency/pickleball-certificate-authenticator2` @ `32e9e1c`**. Evidence:

- **Static files:** all 35 `public/` files are byte-identical on production, and the 7 files that commit deleted return 404.
- **Compiled code:** an LF build of `32e9e1c` reproduces production's client chunks; every app module body is identical, and
  only path-derived IDs differ.
- **PDF:** the PDF output matches production's.
- **This branch vs the live site:** every page's rendered body structure and metadata are identical to production, and
  the certificate API responses are byte-identical (PROJECT-REPORT section 8).

> **Blocker for a "deployment-ready" claim:** DigitalOcean's active source (repo, branch, commit) has not been read from
> the DO dashboard (no DO access here). See PROJECT-REPORT section 11, step 1.

## 3. Head script implementation (`src/app/layout.js`)

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

- This is Google's standard snippet, unmodified. It creates `window.dataLayer`, pushes `{'gtm.start', event:'gtm.js'}` and
  inserts an **async** `<script src="https://www.googletagmanager.com/gtm.js?id=GTM-KMXDPND9">`.
- It uses `next/script` with `strategy="beforeInteractive"` in the root layout, the supported App Router way to run a script
  before hydration on every page. Next renders it into `<head>` as
  `<script>(self.__next_s=self.__next_s||[]).push([0,{"children":"…","id":"google-tag-manager"}])</script>`, and its
  bootstrap runs it **once per full page load**.
- The root layout stays mounted across client-side navigations, so the snippet never re-runs on route changes. A serialized
  copy of the props in the RSC payload (`self.__next_f.push(...)`) is data, not executed code.

## 4. Noscript iframe implementation

```jsx
<body className={`${roboto.className} antialiased flex flex-col min-h-screen`}>
	{/* Google Tag Manager (noscript) */}
	<noscript>
		<iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0"
			style={{ display: "none", visibility: "hidden" }} />
	</noscript>
	{/* End Google Tag Manager (noscript) */}
	<GlobalStateProvider>...
```

Rendered on Next.js 15.5.28 (all pages):
`<body class="…"><div hidden=""><!--$--><!--/$--></div><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMXDPND9" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>…`

- Next 15 always emits its own empty hidden metadata `<div>` as the first element of every prerendered `<body>`
  (`serveStreamingMetadata` is hard-coded on for prerendering). So the GTM `<noscript>` is the **second** element: the
  first thing the app renders, with nothing else in front of it. This placement was accepted.
- No HTML rewriting or Next.js internals were changed.
- With JavaScript on, browsers treat `<noscript>` content as text, so the iframe only exists for visitors without JavaScript.

## 5. Duplicate-check results (final build, Next.js 15.5.28)

| Check | Result |
|---|---|
| Executable GTM snippets per served page (`/`, `/contact`, `/privacy-policy`, `/terms-of-service`, 404) | **1** each, in `<head>` |
| Noscript iframes per page | **1** each, directly after Next's hidden `<div>` |
| GTM IDs in each page | only `GTM-KMXDPND9` |
| After load (`/`): `<script src=…gtm.js>` / `gtm.js` requests / `dataLayer` `gtm.js` events | 1 / 1 / 1 (`gtm.js`, `gtm.dom`, `gtm.load`) |
| `google_tag_manager` containers | `GTM-KMXDPND9` only |
| Client-side navigations `/` → `/contact` → `/terms-of-service` → `/privacy-policy` → `/`, then back and forward (no reload, verified with an in-page marker) | still 1 / 1 / 1 at every step |
| Full reload ("Search again" link), 404 page, fresh tab per route | 1 / 1 / 1 per page load (expected) |
| reCAPTCHA alongside GTM | `api.js` loaded once, `grecaptcha.execute` ready on every page, token issued on contact submit |

## 6. Page coverage

| Route | HTTP | GTM head snippet | Noscript |
|---|---|---|---|
| `/` (hero, search, verified/failed views) | 200 | yes | yes |
| `/contact` | 200 | yes | yes |
| `/privacy-policy` | 200 | yes | yes |
| `/terms-of-service` | 200 | yes | yes |
| any unknown URL (404 page) | 404 | yes | yes |
| `/api/*` (JSON/PDF) | n/a | not applicable | n/a |

Every page inherits GTM from the single root layout. The exception is Next's built-in **500** page
(`.next/server/pages/500.html`, shown only on an unhandled server error). It renders outside the root layout and has no
GTM, the same as before.

## 7. Build, lint and side effects

- `npm run lint`: **0 errors**, 10 pre-existing warnings, no suppressions. The broken `next/babel` ESLint config was
  fixed on this branch (commit `06b94df`). `src/app/layout.js` has no lint findings.
- `npm run build` (Next.js 15.5.28): exit 0, lint runs, 9/9 static pages.
- **Metadata and SEO:** title, description, favicon, viewport, `lang` and charset are identical to production on every page.
  GTM adds nothing to them.
- **Side effect 1 (no visual effect):** Tailwind's JIT scanner picks up the word `hidden` in the iframe's standard
  `visibility:"hidden"` style and adds `.hidden{display:none}` to the CSS. No element uses a bare `hidden` class (scan of all
  55 built HTML/JS/RSC files; only responsive `sm:hidden`), so nothing changes visually.
- **Side effect 2 (14.1 build only):** on Next 14.1.0, the explicit `<head>` meant the 404 boundary's chunk was no longer
  preloaded (it was covered by the layout chunk). The 404 page was tested on both 14.1 and 15.5 and renders correctly.

## 8. Regression results relevant to GTM

All application regression tests pass on the final branch (full matrix in PROJECT-REPORT section 8):

- The rendered body structure of all 5 pages is identical to the live site apart from GTM's noscript and Next's hidden `<div>`.
- Certificate API responses are byte-identical to production's, and PDF content is identical.
- Search, result views, PDF download, contact form and reCAPTCHA, navigation, mobile layout and Lottie/GSAP animations all pass.
- Browser console: no messages on any page (the 404 page logs only its own expected 404).

## 9. Known issues and limitations (GTM)

1. **Not verified on the live domain yet.** Tag Assistant, real-domain behavior and Cloudflare caching of the new HTML
   can only be checked after deployment (section 11).
2. Container `GTM-KMXDPND9` (published version 1) has **no tags or triggers**: no GA4/Ads measurement ID. GTM loads, but
   **no analytics data is recorded until tags are added in GTM**. When adding GA4, don't combine a "page_view on History
   Change" tag with GA4 enhanced measurement's "page changes based on browser history events", or SPA page views will
   double count.
3. Next's built-in 500 page has no GTM (section 6).
4. GTM loads with no consent banner (the site has none). Configure Consent Mode in GTM if consent becomes a requirement.
5. There is no Content-Security-Policy. If one is added, it must allow `www.googletagmanager.com` and the tags' domains.

## 10. Repository-to-production compatibility status

| Question | Status |
|---|---|
| Production source identified? | **Yes, by artifact fingerprint**: `authenticator2@32e9e1c` |
| Recovered into the dgency repo? | **Yes, locally**: `e9f8b36` (and the `recovery/production-baseline` branch). Not pushed |
| dgency `main` matches production? | **No.** It lacks the hero/search, results views and contact form |
| This branch built on production's source? | **Yes** |
| DigitalOcean deployment source confirmed? | **No, pending your dashboard check** |

## 11. Post-deployment Tag Assistant verification

1. https://pickleballcertifiedauthentic.com/ → *View source*: one `GTM-KMXDPND9` snippet in `<head>` (inside
   `self.__next_s.push(...)`) and the `ns.html?id=GTM-KMXDPND9` noscript right after Next's `<div hidden="">` at the start of `<body>`.
2. DevTools → *Network* → filter `gtm.js`: exactly **one** request, status 200.
3. DevTools → *Console*: `dataLayer.filter(e => e.event === 'gtm.js').length` → `1`; `Object.keys(google_tag_manager)`
   includes `GTM-KMXDPND9`.
4. https://tagassistant.google.com/ → *Add domain* → the site URL → *Connect*. Container **GTM-KMXDPND9** should be
   *Connected*, with *Container Loaded*, *DOM Ready* and *Window Loaded* once.
5. While connected, click footer links (Contact, Terms, Privacy) and the logo. **No second *Container Loaded*** should
   appear. The container has no triggers yet, so you'll most likely see **no** *History Change* events either. That's expected.
6. Repeat steps 1–3 on `/contact` and on a nonexistent URL.

## 12. Push and deployment

See PROJECT-REPORT section 10 (exact push and PR commands), section 11 (safe DigitalOcean sequence) and section 12
(rollback).

## 13. Final status (GTM)

- **Completed and verified (locally):** GTM head snippet and noscript on every public page; exactly one container per page
  load; no duplicates across client navigation and history; no interference with reCAPTCHA; metadata and SEO unchanged;
  verified on both Next 14.1.0 and 15.5.28.
- **Completed but not verified:** live-domain behavior (Tag Assistant, CDN caching), which needs deployment.
- **Blocked:** deployment readiness, until DigitalOcean's active source is confirmed.
- **Remaining manual steps:** DO source check, review and push, deploy, Tag Assistant, and adding tags to the container if
  analytics are wanted.
