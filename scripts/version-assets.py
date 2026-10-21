"""Refresh static asset URLs so new deployments load the matching CSS and JS."""

from hashlib import sha256
from pathlib import Path
import re


root = Path(__file__).resolve().parent.parent
pages = [root / "index.html", root / "ko" / "index.html"]


def version(match):
    name = match.group(1)
    digest = sha256((root / name).read_bytes()).hexdigest()[:12]
    return f'"/{name}?v={digest}"'


for page in pages:
    source = page.read_text(encoding="utf-8")
    updated = re.sub(
        r'"/(styles\.css|stream\.js|favicon\.svg)(?:\?v=[a-f0-9]+)?"',
        version,
        source,
    )
    if updated != source:
        page.write_text(updated, encoding="utf-8")
        print(f"Updated static asset versions in {page.relative_to(root)}.")
    else:
        print(f"Static asset versions are current in {page.relative_to(root)}.")
