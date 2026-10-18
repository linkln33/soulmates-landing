"""Encode the images the homepage and site chrome serve (run from anywhere;
needs Pillow with AVIF/WebP):
- public/home/: the hero compositions, trimmed to their visible edge
  (transparent margin only), as AVIF and WebP at 640/960/1280/full width.
- public/brand/: the header/footer logo at 56/112/168 px wide (1x/2x/3x)
  from the synced public/app-content/logo.png, the quiz header mark at
  32/64/96 px from public/logo.png, and small favicons from public/favicon.png.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]

def sized(im, w):
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)

for src, name in [('home-hero-phone-features.png', 'hero-composition'), ('home-hero-phone-features-bg.png', 'hero-composition-bg')]:
    im = Image.open(ROOT / 'assets/source' / src).convert('RGBA')
    im = im.crop(im.getchannel('A').getbbox())
    for w in (640, 960, 1280, im.width):
        r = sized(im, w)
        r.save(ROOT / f'public/home/{name}-{w}.webp', 'WEBP', quality=82, method=6)
        r.save(ROOT / f'public/home/{name}-{w}.avif', 'AVIF', quality=60)
    print(name, im.size)

brand = ROOT / 'public/brand'
brand.mkdir(exist_ok=True)
logo = Image.open(ROOT / 'public/app-content/logo.png').convert('RGBA')
for w in (56, 112, 168):
    sized(logo, w).save(brand / f'logo-{w}.webp', 'WEBP', quality=90, method=6)
mark = Image.open(ROOT / 'public/logo.png').convert('RGBA')
for w in (32, 64, 96):
    sized(mark, w).save(brand / f'mark-{w}.webp', 'WEBP', quality=90, method=6)
fav = Image.open(ROOT / 'public/favicon.png').convert('RGBA')
for w in (32, 192):
    sized(fav, w).save(brand / f'icon-{w}.png', optimize=True)
print('brand', sorted(p.name for p in brand.iterdir()))
