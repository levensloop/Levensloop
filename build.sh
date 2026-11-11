#!/bin/bash
set -e
cd "$(dirname "$0")"
JS="src/data.js src/events.js src/engine.js src/career.js src/sectors.js src/icons.js src/avatar.js src/house.js src/choices.js src/create.js src/circle.js src/fight.js src/celeb.js src/ui.js src/assets.js src/finance.js src/family.js src/minigames.js src/crime2.js src/health.js src/leisure.js src/acts.js src/events2.js src/prison.js src/biz.js src/social.js src/realty.js src/school.js src/legacy.js src/politics.js src/polsys.js src/prlite.js src/politics2.js src/politics3.js src/pres.js src/reg.js src/mil.js src/mil2.js src/war.js src/mil3.js src/occ.js src/eco.js src/eco2.js src/eco3.js src/coup.js src/coup2.js src/diag.js"
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
# testapp (verbeterplan 2.1): zelfde app, maar statusbalk black-translucent, eigen naam en eigen opslag.
# Thijmen zet test.html los op zijn beginscherm; zijn echte levens worden daar niet gezien of aangeraakt.
sed -e 's#apple-mobile-web-app-status-bar-style" content="default"#apple-mobile-web-app-status-bar-style" content="black-translucent"#' \
    -e 's#<meta name="apple-mobile-web-app-title" content="Levensloop">#<meta name="apple-mobile-web-app-title" content="LL test">#' \
    -e 's#href="manifest.webmanifest"#href="manifest-test.webmanifest"#' \
    -e 's#<title>Levensloop</title>#<title>Levensloop test</title>#' \
    -e "s#^const APP_VERSION=#window.LEVENSLOOP_KEY='levensloop.test.v1';window.LEVENSLOOP_TEST=1;\nconst APP_VERSION=#" \
    pwa/index.html > pwa/test.html
sed -e 's#"name": "Levensloop"#"name": "Levensloop test"#' -e 's#"short_name": "Levensloop"#"short_name": "LL test"#' \
    -e 's#"start_url": "./"#"start_url": "./test.html"#' src/pwa/manifest.webmanifest > pwa/manifest-test.webmanifest
for k in 'content="black-translucent"' 'manifest-test.webmanifest' "LEVENSLOOP_KEY='levensloop.test.v1'"; do grep -q "$k" pwa/test.html || { echo "test.html mist $k"; exit 1; }; done
echo "offline-app versie $V: $(wc -c < pwa/index.html) bytes"
