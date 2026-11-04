"""Generate optimized site images from source assets (run locally, commit output).

Usage:  python -I scripts/build_images.py [--inter-dir DIR] [--mono FILE]

Outputs (assets/images/):
  profile-200.{webp,jpg}, profile-400.{webp,jpg}  square crop of profile.jpg
  og-default.png      1200x630 social preview card
  apple-touch-icon.png 180x180

profile.jpg (3024x4032, 1.47 MB) stays in the repo as the source but is
excluded from the published site in _config.yml. EXIF is not copied to outputs.
Fonts are only needed for the OG card; defaults point to a local MiKTeX Inter
and Windows Fira-alike mono, override with the flags above.
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"

# Square crop of the source photo, centred on the subject (px in source).
PROFILE_CROP = (1000, 1850, 2200, 3050)

BG = (0x0B, 0x0F, 0x14)        # --bg-primary
ELEV = (0x11, 0x18, 0x27)      # --bg-secondary
ACCENT = (0x00, 0xFF, 0xC6)    # --accent
TEXT = (0xF1, 0xF5, 0xF9)      # --text-heading
MUTED = (0x94, 0xA3, 0xB8)     # --text-muted


def profile() -> None:
    src = ImageOps.exif_transpose(Image.open(IMG / "profile.jpg")).convert("RGB")
    square = src.crop(PROFILE_CROP)
    for size in (200, 400):
        out = square.resize((size, size), Image.LANCZOS)
        out.save(IMG / f"profile-{size}.jpg", quality=82, optimize=True, progressive=True)
        out.save(IMG / f"profile-{size}.webp", quality=80, method=6)
        print(f"profile-{size}: jpg {(IMG / f'profile-{size}.jpg').stat().st_size} B, "
              f"webp {(IMG / f'profile-{size}.webp').stat().st_size} B")


def _font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def og_card(inter_dir: Path, mono: Path) -> None:
    w, h = 1200, 630
    im = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(im)
    # Subtle graph motif (the site's node-graph language), top-right.
    nodes = [(880, 110), (1010, 70), (1120, 170), (960, 230), (1080, 300), (900, 360), (1150, 420)]
    edges = [(0, 1), (1, 2), (0, 3), (3, 2), (3, 4), (4, 6), (3, 5), (5, 4), (2, 4)]
    for a, b in edges:
        d.line([nodes[a], nodes[b]], fill=(0x0E, 0x3B, 0x36), width=2)
    for x, y in nodes:
        d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=ELEV, outline=ACCENT, width=2)
    d.rectangle([80, 120, 86, 510], fill=ACCENT)
    d.text((120, 130), "> hello_world", font=_font(mono, 30), fill=ACCENT)
    d.text((120, 185), "Alessandro Bragetti", font=_font(inter_dir / "Inter-ExtraBold.otf", 76), fill=TEXT)
    d.text((120, 290), "SAP BTP & Full Stack Developer", font=_font(inter_dir / "Inter-Bold.otf", 48), fill=TEXT)
    d.text((120, 370), "SAP CAP · Node.js · SAPUI5 / Fiori · OData · Integration Suite",
           font=_font(inter_dir / "Inter-Regular.otf", 30), fill=MUTED)
    d.text((120, 430), "AI Engineering · Cybersecurity · Intelligent Systems",
           font=_font(mono, 26), fill=MUTED)
    d.text((120, 545), "lordeassan.github.io", font=_font(mono, 26), fill=ACCENT)
    im.save(IMG / "og-default.png", optimize=True)
    print(f"og-default.png {(IMG / 'og-default.png').stat().st_size} B")


def touch_icon(mono: Path) -> None:
    im = Image.new("RGB", (180, 180), BG)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([14, 14, 166, 166], radius=30, outline=ACCENT, width=4)
    f = _font(mono, 58)
    text = "AB"
    l, t, r, b = d.textbbox((0, 0), text, font=f)
    d.text(((180 - (r - l)) / 2 - l, (180 - (b - t)) / 2 - t), text, font=f, fill=ACCENT)
    im.save(IMG / "apple-touch-icon.png", optimize=True)
    print(f"apple-touch-icon.png {(IMG / 'apple-touch-icon.png').stat().st_size} B")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--inter-dir", type=Path,
                    default=Path.home() / "AppData/Local/Programs/MiKTeX/fonts/opentype/public/inter")
    ap.add_argument("--mono", type=Path, default=Path("C:/Windows/Fonts/CascadiaMono.ttf"))
    a = ap.parse_args()
    profile()
    og_card(a.inter_dir, a.mono)
    touch_icon(a.mono)


if __name__ == "__main__":
    main()
