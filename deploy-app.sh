#!/bin/bash
# zet de offline app (pwa/) op GitHub Pages: github.com/levensloop/levensloop
set -e
cd "$(dirname "$0")"
bash build.sh >/dev/null
G="${LEVENSLOOP_GH:-$(cd .. && pwd)/levensloop-gh}"
[ -d "$G/.git" ] || git clone --depth 1 -b main https://github.com/levensloop/levensloop "$G"
# veiligheid: alleen naar main, nooit naar de bron-branch
[ "$(git -C "$G" rev-parse --abbrev-ref HEAD)" = "main" ] || { echo "$G staat niet op branch main, gestopt."; exit 1; }
git -C "$G" pull -q --ff-only origin main || true
cp -r pwa/. "$G/"
cd "$G"
git add -A
git diff --cached --quiet && { echo "Geen wijzigingen."; exit 0; }
git -c user.name="Levensloop" -c user.email="levensloop@users.noreply.github.com" commit -q -m "Update Levensloop ($(grep -o "APP_VERSION='[^']*'" index.html | cut -d"'" -f2))

${COMMIT_TRAILER:-}"
git push -q origin main && echo "Online gezet."
