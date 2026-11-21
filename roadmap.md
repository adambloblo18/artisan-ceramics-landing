# SEO visibility pass
- [x] Replace crawler rules and add the requested homepage sitemap, llms.txt and IndexNow key.
- [x] Consolidate homepage structured data, update its title and separate heading words; preserve the existing FAQ literally.
- [x] Verify four exact 200 responses, initial HTML, legal noindex, console and 19 regression tests; do not publish.
- [ ] Verify XML MIME type: preview static serving returns application/octet-stream despite public/_headers; production header is configured but cannot be checked without publication.
- Existing FAQ discrepancy: delays, prescribers and atelier-visit answers are abbreviated in the preserved schema versus the visible FAQ; changing them conflicts with the request to keep FAQPage unchanged.

# Mobile loading pass
- [x] Restore independent delayed Google Ads loading and consent-mode events.
- [x] Delay restored measurement consent and isolate loader errors.
- [x] Verify the requested consent flows at 390 px with an empty cache and report pre-hero requests; normal network has no console/hydration errors, throttled preview intermittently warns about existing form attributes.
- [x] Defer or disable hero video; keep the poster first.
- [x] Keep one hero preload and one first-screen font preload; lazy-load lower images.
- [x] Load measurement code only after cookie acceptance; verify refusal and reopening.
- [x] Run 10 tests and local browser checks; capture the preview request waterfall.
- Previous-pass limit (outside this request): production-served verification has no supplied production artifact; manual project builds are disallowed in this environment.
- Previous-pass limit (outside this request): pointer access to the footer cookie link is covered by the existing fixed action bar; keyboard activation and consent changes are verified.
- [x] Verify form payload and redirect with a simulated service response; real email delivery remains unverified to avoid sending a false lead.
- [x] Report changes and verification limits; do not publish.