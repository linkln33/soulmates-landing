# Homepage hero sources

- `home-hero-phone-features.png`: the approved English composition (phone with floating cards and light trails, transparent background). The "Martin" avatar is a synthetic illustrative face; scores are illustrative and the page labels them so.
- `home-hero-phone-features-bg.png`: the Bulgarian version, made from the English one by `localize-hero-bg.py` (each English line inpainted away and redrawn in Inter at the same angle, size and colour; wording from the app's `lib/i18n/messages/bg.ts`). Rerun: `python3 localize-hero-bg.py home-hero-phone-features.png home-hero-phone-features-bg.png InterVariable.ttf` with opencv-python-headless, numpy and Pillow, and the full Inter variable TTF.
- `encode-images.py`: writes the AVIF/WebP hero sizes in `public/home/`, and the small logo, quiz mark and favicons in `public/brand/`. These sources are not served.
