#!/usr/bin/env bash
# Пересобирает демо-страницу и публикует её в ветку gh-pages
# (GitHub Pages: https://siwaaa.github.io/design-system-01/).
set -euo pipefail
cd "$(dirname "$0")/.."

pnpm exec vite build --base=./

tmp=$(mktemp -d)
cp -r dist/* "$tmp"/
touch "$tmp/.nojekyll"
git -C "$tmp" init -qb gh-pages
git -C "$tmp" -c user.name="Siwaaa" -c user.email="siwaa@mail.ru" \
  add -A
git -C "$tmp" -c user.name="Siwaaa" -c user.email="siwaa@mail.ru" \
  commit -qm "Deploy demo"
git -C "$tmp" push -f https://github.com/Siwaaa/design-system-01.git gh-pages:gh-pages
rm -rf "$tmp"
echo "Демо опубликовано: https://siwaaa.github.io/design-system-01/"
