#!/bin/bash
# Eén testcommando: bouwen, testserver, korte simulaties, migratietest.
#   bash tests/run.sh          korte ronde (4 landen, 1 leven per land, passief en aap)
#   FULL=1 bash tests/run.sh   volledige ronde voor het afsluiten van een fase (17 landen, 2 levens per land)
# Eindigt met foutcode 1 bij JS-fouten (behalve die in tests/bekende-fouten.txt), vastlopers of een mislukte migratie.
set -u
cd "$(dirname "$0")/.."
ROOT=$(pwd)
OUT="$ROOT/tests/out"; mkdir -p "$OUT"
RC=0

echo "== bouwen"
bash build.sh || { echo "✗ bouwen mislukt"; exit 1; }

echo "== testserver"
STARTED=""
if ! curl -s -o /dev/null http://localhost:8765/; then
  (cd pwa && exec python3 -m http.server 8765 >/dev/null 2>&1) &
  STARTED=$!
  for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:8765/ && break; sleep 0.2; done
fi
trap '[ -n "$STARTED" ] && kill $STARTED 2>/dev/null' EXIT

if [ "${FULL:-0}" = "1" ]; then CCS="NL,US,DE,UK,FR,BE,JP,BR,MA,TR,ES,IT,CA,AU,MX,ZA,ID"; N=2; else CCS="${CC:-NL,US,JP,BR}"; N=1; fi
PAR=${PAR:-4}

cd tests/review
echo "== passieve simulatie ($CCS, $N per land)"
CC=$CCS LIVES=$N PAR=$PAR MONKEY=0 OUT="$OUT/passive.json" node sim.js | sed 's/^/   /'
echo "== aap-simulatie ($CCS, $N per land)"
CC=$CCS LIVES=$N PAR=$PAR MONKEY=1 OUT="$OUT/monkey.json" node sim.js | sed 's/^/   /'
echo "== kerncijfers (vergelijk met tests/nulmeting/)"
node stats.js "$OUT/passive.json" "$OUT/monkey.json" | sed 's/^/   /'

echo "== fouten en vastlopers"
node check.js "$OUT/passive.json" "$OUT/monkey.json" || RC=1

echo "== regressietests (opgeloste fouten)"
node regress.js | sed 's/^/   /'; [ ${PIPESTATUS[0]} = 0 ] || RC=1

echo "== meetscherm en indeling"
node diag.test.js | sed 's/^/   /'; [ ${PIPESTATUS[0]} = 0 ] || RC=1

echo "== migratie van oude levens"
node migratie.js || RC=1

echo
if [ $RC = 0 ]; then echo "✓ GROEN"; else echo "✗ ROOD"; fi
exit $RC
