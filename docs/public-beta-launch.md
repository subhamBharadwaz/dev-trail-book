# Public beta launch checks

Checked on 23 November 2026. This is an implementation and review record, not a claim of Google indexing, a security certification or verified skill mastery.

## Release scope

- The same Astro-generated page layout hydrates in React; public lessons do not wait for account restoration.
- Public visitors can start from `/start-here`, follow the Web foundations path, read examples and use practice without signing in.
- About, privacy/data and feedback pages explain the beta, authorship, AI-assisted development, local records, optional sync and limits.
- Guest records are not silently copied to an account. After sign-in, Account & sync offers a deliberate local import.
- Footer links reach those pages from every normal route. GitHub issue forms collect bugs/content corrections and suggestions without requesting private data.
- Homepage and lesson metadata include canonical URLs and the existing OG image. Public pages appear in the sitemap; personal workspaces remain noindex.
- The Google HTML ownership-verification tag is emitted on the homepage. Forks should replace it with their own verification tag.

## Showcase content review

The source code in each lesson’s metadata and its first worked MDX code block is exercised by `packages/content/tests/showcase-examples.test.ts`. Review notes deliberately distinguish a code/reference check from device testing or verification of every exercise.

| Lesson                 | Scope checked                                                                                                                      | Reference                                                                                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Closures               | Private bindings and independent counter instances                                                                                 | [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)                                                                                                                                          |
| Promises & async/await | Concurrent request start, result mapping, HTTP and network failure propagation                                                     | [MDN async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) |
| Event loop             | Synchronous output, promise/queued microtask order, then timer; executed in Bun, browser description checked against the reference | [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)                                                                                                                        |
| Binary search          | Empty, singleton, duplicates, negative values, absent/boundary targets against a linear lower-bound oracle                         | [CP Algorithms](https://cp-algorithms.com/num_methods/binary_search.html)                                                                                                                                                       |
| Discriminated unions   | Outputs for all four states; TypeScript strict-mode check, including rejection of missing success data and an unknown state        | [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)                                                                                                                                           |

Runtime review environment: Bun 1.4.4. Union compile check: installed TypeScript 7, strict mode. Other lessons retain their pending technical-review status.

## Live service checks

- GitHub repository is public and issues are enabled.
- Supabase public settings report email and GitHub sign-in enabled.
- GitHub authorization starts with HTTP 302 to github.com, scope `user:email`, and the Supabase callback. No repository scope was requested. This does not verify the complete authenticated round trip.
- The deployed closures page was returned as a lesson with its own title/description, canonical and OG metadata, rather than homepage content.
- The deployed OG image returned HTTP 200.
- The public PageSpeed Insights API returned HTTP 429 / quota exhausted. No performance score or Core Web Vitals result is claimed.

## Account-owner steps

After the release is live:

1. In Google Search Console, use a **URL-prefix** property for `https://dev-trailbook.pages.dev/` and the **HTML tag** verification method. A `pages.dev` subdomain does not give this project control of the parent domain’s DNS.
2. Click Verify once the installed HTML tag is visible on the public homepage. Do not remove the tag after verification.
3. Submit `https://dev-trailbook.pages.dev/sitemap-index.xml` in Sitemaps.
4. Use URL Inspection for the homepage and a few lessons. Indexing is Google’s decision; submitting URLs is not a ranking guarantee.
5. Finish one real GitHub sign-in and verify that a deliberately changed study record appears on a second device. Do not put sign-in links or study backups in public issues.
6. Test navigation, search, lesson tabs, keyboard focus, the theme control and export at phone, tablet and desktop widths. Repeat in both themes and with reduced motion enabled.
7. Run the public site through [PageSpeed Insights](https://pagespeed.web.dev/) when available. Record the measured results, including the date and tested URL; do not substitute bundle sizes for real performance measurements.

Local browser access was disabled during preparation. Automated behavior, hydration and static-output checks cover what can be verified without a real browser; they do not replace those device checks.
