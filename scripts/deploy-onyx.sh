#!/usr/bin/env bash
set -euo pipefail

# Deploy TavernBoard (p/<NAMESPACE>/tavernkit + r/<NAMESPACE>/tavernboard) to Gno.land Onyx testnet (onyx-1).
# Usage: ./scripts/deploy-onyx.sh <gnokey_name> <your_g1_address>

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <gnokey_name> <your_g1_address> [--dry-run]"
  exit 1
fi

KEY_NAME="$1"
NAMESPACE="$2"
DRY_RUN="${3:-}"

CHAIN_ID="${CHAIN_ID:-onyx-1}"
REMOTE="${REMOTE:-https://rpc.onyx.testnets.gno.land:443}"
GAS_FEE="${GAS_FEE:-1000000ugnot}"
GAS_WANTED="${GAS_WANTED:-40000000}"
MAX_DEPOSIT="${MAX_DEPOSIT:-50000000ugnot}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
P_PATH="gno.land/p/${NAMESPACE}/tavernkit"
R_PATH="gno.land/r/${NAMESPACE}/tavernboard"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/p/tavernkit" "$STAGE/r/tavernboard"
cp -R "$ROOT_DIR/p/tavernkit/." "$STAGE/p/tavernkit/"
cp -R "$ROOT_DIR/r/tavernboard/." "$STAGE/r/tavernboard/"

sed -i.bak "s|gno.land/p/tavernboard/tavernkit|${P_PATH}|g" "$STAGE/p/tavernkit/gnomod.toml"
sed -i.bak "s|gno.land/r/tavernboard/tavernboard|${R_PATH}|g" "$STAGE/r/tavernboard/gnomod.toml"
rm -f "$STAGE/p/tavernkit/gnomod.toml.bak" "$STAGE/r/tavernboard/gnomod.toml.bak"

for f in "$STAGE/r/tavernboard"/*.gno; do
  sed -i.bak "s|gno.land/p/tavernboard/tavernkit|${P_PATH}|g" "$f"
  rm -f "${f}.bak"
done

echo "Deploying to ${CHAIN_ID} (${REMOTE}):"
echo "  1) ${P_PATH}"
echo "  2) ${R_PATH}"

if [[ "$DRY_RUN" == "--dry-run" ]]; then
  echo "[dry-run] gnokey maketx addpkg -pkgpath \"${P_PATH}\" -pkgdir \"$STAGE/p/tavernkit\" -gas-fee ${GAS_FEE} -gas-wanted ${GAS_WANTED} -max-deposit ${MAX_DEPOSIT} -chainid ${CHAIN_ID} -remote ${REMOTE} -broadcast ${KEY_NAME}"
  echo "[dry-run] gnokey maketx addpkg -pkgpath \"${R_PATH}\" -pkgdir \"$STAGE/r/tavernboard\" -gas-fee ${GAS_FEE} -gas-wanted ${GAS_WANTED} -max-deposit ${MAX_DEPOSIT} -chainid ${CHAIN_ID} -remote ${REMOTE} -broadcast ${KEY_NAME}"
  exit 0
fi

gnokey maketx addpkg \
  -pkgpath "${P_PATH}" \
  -pkgdir "$STAGE/p/tavernkit" \
  -gas-fee "${GAS_FEE}" \
  -gas-wanted "${GAS_WANTED}" \
  -max-deposit "${MAX_DEPOSIT}" \
  -chainid "${CHAIN_ID}" \
  -remote "${REMOTE}" \
  -broadcast "${KEY_NAME}"

gnokey maketx addpkg \
  -pkgpath "${R_PATH}" \
  -pkgdir "$STAGE/r/tavernboard" \
  -gas-fee "${GAS_FEE}" \
  -gas-wanted "${GAS_WANTED}" \
  -max-deposit "${MAX_DEPOSIT}" \
  -chainid "${CHAIN_ID}" \
  -remote "${REMOTE}" \
  -broadcast "${KEY_NAME}"

echo ""
echo "DEPLOYED LIVE ON ONYX (${CHAIN_ID})!"
echo "  gnoweb URL : https://onyx.testnets.gno.land/r/${NAMESPACE}/tavernboard"
echo "  Pure pkg   : https://onyx.testnets.gno.land/p/${NAMESPACE}/tavernkit"
