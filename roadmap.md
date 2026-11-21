# Mobile loading pass
- [x] Defer or disable hero video; keep the poster first.
- [x] Keep one hero preload and one first-screen font preload; lazy-load lower images.
- [x] Load measurement code only after cookie acceptance; verify refusal and reopening.
- [x] Run 10 tests and local browser checks; capture the preview request waterfall.
- [ ] Production-served verification: no production artifact is supplied by the harness; manual project builds are disallowed in this environment.
- [ ] Pointer access to the footer cookie link: the existing fixed action bar covers it at the page bottom; a visible layout change is outside the user's permitted scope. Keyboard activation and consent changes are verified.
- [x] Verify form payload and redirect with a simulated service response; real email delivery remains unverified to avoid sending a false lead.
- [x] Report changes and verification limits; do not publish.