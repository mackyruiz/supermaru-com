#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p tmp/sitemaps
for name in posts-post posts-page taxonomies-category taxonomies-post_tag; do
  curl --fail --silent --show-error --resolve www.supermaru.com:443:208.109.28.20 \
    "https://www.supermaru.com/wp-sitemap-$name-1.xml" -o "tmp/sitemaps/$name.xml"
done
python3 - <<'PY'
from pathlib import Path
from urllib.parse import urlparse, unquote
import xml.etree.ElementTree as E
import json
sitemap_urls = {loc.text for file in Path('tmp/sitemaps').glob('*.xml') for loc in E.parse(file).findall('.//{*}loc')}
# WordPress omits unused taxonomy terms and includes home in its page sitemap.
# Check the full REST inventory as well, not merely the currently emitted subset.
inventory = {item['link'] for kind in ['posts', 'pages', 'categories', 'tags'] for item in json.loads(Path(f'tmp/wp/{kind}.json').read_text())}
urls = sitemap_urls | inventory
missing = [url for url in sorted(urls) if not (Path('dist') / unquote(urlparse(url).path).strip('/') / 'index.html').is_file()]
for url in missing:
    print('Missing:', url)
for name in ['2015/index.html', '2015/10/index.html', 'rss.xml', '404.html', 'feed/index.html', 'sitemap-index.xml']:
    if not (Path('dist') / name).is_file():
        missing.append(name)
        print('Missing:', name)
print(f'{len(sitemap_urls)} live sitemap URLs; {len(inventory)} REST URLs; {len(urls)} unique checked; {len(missing)} missing')
assert len(inventory) == 160, f'Expected 160 REST URLs, got {len(inventory)}'
assert not missing, 'URL parity failed'
PY
