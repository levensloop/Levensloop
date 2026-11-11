#!/bin/bash
set -e
cd "$(dirname "$0")"
JS="src/data.js src/events.js src/engine.js src/career.js src/sectors.js src/icons.js src/avatar.js src/house.js src/choices.js src/create.js src/circle.js src/fight.js src/celeb.js src/ui.js src/assets.js src/finance.js src/debt.js src/family.js src/minigames.js src/crime2.js src/health.js src/leisure.js src/acts.js src/events2.js src/prison.js src/biz.js src/social.js src/realty.js src/school.js src/legacy.js src/politics.js src/polsys.js src/prlite.js src/politics2.js src/politics3.js src/pres.js src/reg.js src/mil.js src/mil2.js src/war.js src/mil3.js src/occ.js src/eco.js src/eco2.js src/eco3.js src/coup.js src/coup2.js src/diag.js src/vangnet.js"
SP=$(mktemp -d)
# 1) claude.ai-versie
{
  cat src/head.html
  echo '<style>'
  cat src/theme.css
  echo '</style>'
  cat src/body.html
  echo '<script>'
  echo '"use strict";'
  cat $JS
  echo '</script>'
} > index.html
# syntaxcontrole van het hele script
{ cat $JS; } > $SP/all.js
node --check $SP/all.js
# bouwcontroles (verbeterplan 1.12 en 7.1)
D=$(grep -oh "\bP\?E('[a-z0-9_]*'" $JS | sort | uniq -d)
[ -z "$D" ] || { echo "Dubbele gebeurtenis-ID's: $D"; exit 1; }
U=$(grep -oh ".\{9\}S\.job\.perf=clamp(" $JS | grep -v "S\.job&&(" | grep -v "if(S\.job)" || true)
[ -z "$U" ] || { echo "S.job.perf zonder controle op S.job: $U"; exit 1; }
F=$(grep -oh "^function [A-Za-z0-9_]*\|[;}]function [A-Za-z0-9_]*" $JS | sed 's/^[;}]//' | sort | uniq -d | tr '\n' ' ')
[ -z "$F" ] || echo "Let op, dubbele functienamen (de laatste wint): $F"
wc -c index.html
# kopie voor de claude.ai-versie (alleen als die map bestaat)
[ -d ../levensloop-v2 ] && cp index.html ../levensloop-v2/index.html
# 2) offline iPhone-app (PWA)
V=$(date +%Y%m%d-%H%M)
mkdir -p pwa/icons
{
  echo '<!doctype html><html lang="nl"><head><meta charset="utf-8">'
  cat src/pwa/meta.html
  sed 's#<title>Levensloop v2</title>#<title>Levensloop</title>#' src/head.html
  echo '<style>'
  cat src/theme.css
  cat src/pwa/fix.css
  echo '</style></head><body>'
  cat src/body.html
  echo '<script>'
  echo '"use strict";'
  echo "const APP_VERSION='$V';"
  cat $JS
  echo '</script><script>'
  cat src/pwa/pwa.js
  echo '</script></body></html>'
} > pwa/index.html
sed "s/__VERSION__/$V/" src/pwa/sw.tpl.js > pwa/sw.js
cp src/pwa/manifest.webmanifest pwa/manifest.webmanifest
echo "offline-app versie $V: $(wc -c < pwa/index.html) bytes"
