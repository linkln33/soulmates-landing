# Homepage hero sources

- `home-hero-phone-features.png`: the approved English composition (phone with floating cards and light trails, transparent background). The "Martin" avatar is a synthetic illustrative face; scores are illustrative and the page labels them so.
- `home-hero-phone-features-bg.png`: the Bulgarian version, made from the English one by `localize-hero-bg.py` (each English line inpainted away and redrawn in Inter at the same angle, size and colour; wording from the app's `lib/i18n/messages/bg.ts`). Rerun: `python3 localize-hero-bg.py home-hero-phone-features.png home-hero-phone-features-bg.png InterVariable.ttf` with opencv-python-headless, numpy and Pillow, and the full Inter variable TTF.
- `encode-images.py`: writes the AVIF/WebP hero sizes in `public/home/`, and the small logo, quiz mark and favicons in `public/brand/`. These sources are not served.

## /app page portraits

- `app-page/portrait-mila.webp` and `app-page/portrait-martin.webp`: square 768 px crops (WebP q95) of two owner-supplied AI-generated portraits of fictional adults, used for the "match opened" and conversation screens on `/app`. Originals: `SoulMates-Quest-mobile/assets/demo-people/Bulgarian woman in a Sofia café-2.png` (SHA-256 `b8be63e5…b48ccb4`) and `Bulgarian Man at a Sofia Café-1.png` (SHA-256 `3da9d7a5…7b77c18f`), both listed in that folder's `PROVENANCE.md` (19 Oct 2026). The names Mila and Martin are invented for the page, not test-account names. Concealed matches on the page never use a photograph, not even blurred.
- `encode-app-page.mjs`: writes `public/app-page/{mila,martin}-{96,192,288}.{avif,webp}`.
