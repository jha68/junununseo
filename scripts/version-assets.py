"""Refresh static asset URLs so new deployments load the matching CSS and JS."""

from hashlib import sha256
from pathlib import Path
import re


root = Path(__file__).resolve().parent.parent
page = root / "index.html"
source = page.read_text(encoding="utf-8")


def version(match):
    name = match.group(1)
    digest = sha256((root / name).read_bytes()).hexdigest()[:12]
    return f'"/{name}?v={digest}"'


updated = re.sub(
    r'"/(styles\.css|stream\.js|favicon\.svg)(?:\?v=[a-f0-9]+)?"',
    version,
    source,
)
if updated != source:
    page.write_text(updated, encoding="utf-8")
    print("Updated static asset versions in index.html.")
else:
    print("Static asset versions are current.")
