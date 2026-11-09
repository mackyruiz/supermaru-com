#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p tmp/wp
fetch() {
  local kind="$1" fields="$2" expected="$3"
  local page=1 total=1
  while (( page <= total )); do
    curl --fail --silent --show-error --resolve www.supermaru.com:443:208.109.28.20 \
      -D "tmp/wp/$kind.headers" \
      "https://www.supermaru.com/wp-json/wp/v2/$kind?per_page=100&page=$page&_fields=$fields" \
      -o "tmp/wp/$kind.$page.json"
    total=$(node --input-type=module -e 'import fs from "node:fs"; const h=fs.readFileSync(process.argv[1],"utf8"); const m=h.match(/^x-wp-totalpages:\s*(\d+)/im); if(!m) throw Error("Missing pagination header"); console.log(m[1]);' "tmp/wp/$kind.headers")
    ((page+=1))
  done
  node --input-type=module -e '
    import fs from "node:fs";
    const [kind,pages,expected]=process.argv.slice(1);
    const data=Array.from({length:Number(pages)},(_,i)=>JSON.parse(fs.readFileSync(`tmp/wp/${kind}.${i+1}.json`))).flat();
    fs.writeFileSync(`tmp/wp/${kind}.json`,JSON.stringify(data,null,2)+"\n");
    if(data.length!==Number(expected)) throw Error(`${kind}: expected ${expected}, received ${data.length}; partial export saved for diagnosis`);
    console.log(`${kind}: ${data.length}`);
  ' "$kind" "$total" "$expected"
}
fetch posts 'id,date,date_gmt,slug,link,title,excerpt,content,categories,tags,featured_media' 50
fetch pages 'id,date,slug,link,title,content' 1
fetch categories 'id,slug,name,link,parent' 17
fetch tags 'id,slug,name,link' 92
fetch comments 'post,author_name,date,content,parent' 12
fetch media 'id,source_url,alt_text' 139
