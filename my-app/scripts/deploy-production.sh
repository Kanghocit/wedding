#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/var/www/ducanhphamhuyen-love}"

echo "==> Deploy wedding site in ${DEPLOY_PATH}"
cd "${DEPLOY_PATH}"

if [[ -d .git ]]; then
  git fetch origin
  git reset --hard "${DEPLOY_REF:-origin/main}"
fi

corepack enable
pnpm install --frozen-lockfile
pnpm build

if pm2 describe wedding-love &>/dev/null; then
  pm2 reload ecosystem.config.cjs
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "==> Deploy finished OK"
