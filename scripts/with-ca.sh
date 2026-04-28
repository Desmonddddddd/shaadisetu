#!/usr/bin/env bash
# Adds the system + user keychain certs to NODE_EXTRA_CA_CERTS so
# tools like Prisma can validate TLS on networks where Node's bundled
# CA list is incomplete. Use as a wrapper:
#   ./scripts/with-ca.sh npx prisma migrate dev
set -euo pipefail
TMP_CA="${SHAADISETU_CA_BUNDLE:-}"
if [[ -z "$TMP_CA" || ! -f "$TMP_CA" ]]; then
  TMP_CA=$(mktemp -t cabundle.XXXXX.pem)
  security find-certificate -a -p /System/Library/Keychains/SystemRootCertificates.keychain > "$TMP_CA"
  security find-certificate -a -p /Library/Keychains/System.keychain >> "$TMP_CA" 2>/dev/null || true
  export SHAADISETU_CA_BUNDLE="$TMP_CA"
fi
export NODE_EXTRA_CA_CERTS="$TMP_CA"
exec "$@"
