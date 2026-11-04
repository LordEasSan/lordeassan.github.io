"""Static QA for the built site.  Usage: python -I scripts/check_site.py [SITE_DIR]

Checks every HTML page in the build output (default: _site):
  * exactly one <title>, canonical, og:title, meta description, <h1>
  * JSON-LD blocks parse as JSON; Person facts match _data/profile.yml
  * heading levels never skip (h1 → h3 without h2)
  * every <img> has an alt attribute
  * internal links / assets resolve to a file in the build
  * privacy: no private docs, no full-res photo, no phone numbers, no
    certificate-number patterns, plus personal patterns from a git-ignored file
  * sitemap lists only real pages and no private paths
Exit 1 on any failure.
"""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "_site"

PRIVATE_PATHS = ["docs/", "career", "chatgpt-continuity", "assets/images/profile.jpg"]
PRIVATE_TEXT = [
    r"\+39[\s\d]{9,}",                                   # any Italian phone number
    r"(?-i:\bRAL\b)", r"BOZZA", r"colloquio",            # generic job-search terms
    r"candidate (number|no\.?)\s*[:#]?\s*\d", r"certificate (number|no\.?)\s*[:#]?\s*\d",
]
# Personal patterns (exact phone, address, employer/recruiter names) live in a
# git-ignored file so they are never published with this public script.
# One regex per line; lines starting with # are ignored.
_PRIVATE_FILE = ROOT / "docs" / "career" / "privacy_patterns.txt"
if _PRIVATE_FILE.is_file():
    PRIVATE_TEXT += [l.strip() for l in _PRIVATE_FILE.read_text(encoding="utf-8").splitlines()
                     if l.strip() and not l.lstrip().startswith("#")]
else:
    print(f"note: {_PRIVATE_FILE.name} not found - running generic privacy patterns only")
EXPECTED = {"jobTitle": "SAP BTP & Full Stack Developer", "name": "Alessandro Bragetti"}


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.titles = 0
        self.canon = 0
        self.ogt = 0
        self.desc = 0
        self.h = []
        self.imgs_no_alt = []
        self.links = []
        self.jsonld = []
        self._in_ld = False
        self._buf = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.titles += 1
        elif tag == "link" and a.get("rel") == "canonical":
            self.canon += 1
        elif tag == "meta" and a.get("property") == "og:title":
            self.ogt += 1
        elif tag == "meta" and a.get("name") == "description":
            self.desc += 1
        elif re.fullmatch(r"h[1-6]", tag):
            self.h.append(int(tag[1]))
        elif tag == "img" and "alt" not in a:
            self.imgs_no_alt.append(a.get("src"))
        if tag in ("a", "link") and a.get("href"):
            self.links.append(a["href"])
        if tag in ("img", "script", "source") and (a.get("src") or a.get("srcset")):
            for part in (a.get("srcset") or a.get("src")).split(","):
                self.links.append(part.strip().split(" ")[0])
        if tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld, self._buf = True, []

    def handle_data(self, data):
        if self._in_ld:
            self._buf.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_ld:
            self._in_ld = False
            self.jsonld.append("".join(self._buf))


def resolve(href: str, page: Path) -> Path | None:
    href = href.split("#")[0].split("?")[0]
    if not href or href.startswith(("mailto:", "tel:", "data:", "javascript:")):
        return None
    if href.startswith("https://lordeassan.github.io"):
        href = href[len("https://lordeassan.github.io"):] or "/"
    elif re.match(r"^[a-z]+://", href) or href.startswith("//"):
        return None
    if href.startswith("/tarological-system"):  # served by a separate Pages repo
        return None
    base = SITE if href.startswith("/") else page.parent
    t = (base / href.lstrip("/")).resolve()
    return t


def main() -> int:
    fails: list[str] = []
    pages = sorted(SITE.rglob("*.html"))
    for p in pages:
        rel = p.relative_to(SITE).as_posix()
        html = p.read_text(encoding="utf-8")
        pg = Page()
        pg.feed(html)
        for name, val in (("title", pg.titles), ("canonical", pg.canon), ("og:title", pg.ogt), ("description", pg.desc)):
            if val != 1:
                fails.append(f"{rel}: {val} x {name}")
        if pg.h.count(1) != 1:
            fails.append(f"{rel}: {pg.h.count(1)} x h1")
        for a, b in zip(pg.h, pg.h[1:]):
            if b > a + 1:
                fails.append(f"{rel}: heading skip h{a} -> h{b}")
                break
        if pg.imgs_no_alt:
            fails.append(f"{rel}: img without alt {pg.imgs_no_alt}")
        for block in pg.jsonld:
            try:
                data = json.loads(block)
            except json.JSONDecodeError as e:
                fails.append(f"{rel}: invalid JSON-LD ({e})")
                continue
            for node in data.get("@graph", []):
                if node.get("@type") == "Person":
                    for k, v in EXPECTED.items():
                        if node.get(k) != v:
                            fails.append(f"{rel}: Person.{k}={node.get(k)!r}, expected {v!r}")
        for href in pg.links:
            t = resolve(href, p)
            if t is None:
                continue
            if not (t.is_file() or (t / "index.html").is_file()):
                fails.append(f"{rel}: broken internal link {href}")
        text = re.sub(r"<[^>]+>", " ", html)
        for pat in PRIVATE_TEXT:
            if re.search(pat, text, re.I):
                fails.append(f"{rel}: private/job-search text matched /{pat}/")

    all_files = [f.relative_to(SITE).as_posix() for f in SITE.rglob("*") if f.is_file()]
    for f in all_files:
        if any(x in f for x in PRIVATE_PATHS):
            fails.append(f"private file published: {f}")

    sm = (SITE / "sitemap.xml").read_text(encoding="utf-8")
    locs = re.findall(r"<loc>(.*?)</loc>", sm)
    for loc in locs:
        t = resolve(loc, SITE / "index.html")
        if t is not None and not (t.is_file() or (t / "index.html").is_file()):
            fails.append(f"sitemap: {loc} does not exist")
        if any(x in loc for x in PRIVATE_PATHS):
            fails.append(f"sitemap lists private path {loc}")

    print(f"pages: {len(pages)} | files: {len(all_files)} | sitemap urls: {len(locs)}")
    for f in fails:
        print("FAIL", f)
    print("RESULT:", "PASS" if not fails else f"FAIL ({len(fails)})")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
