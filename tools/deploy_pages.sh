#!/bin/sh
# 公开发布到 GitHub Pages（需先 `gh auth login`）。用法：sh tools/deploy_pages.sh <repo-name>
set -e
REPO="${1:-endfield-tactical-lab}"
cd "$(dirname "$0")/.."
gh repo create "$REPO" --public --source=. --push 2>/dev/null || git push -u origin main
git subtree split --prefix dist -b gh-pages-tmp
git push -f origin gh-pages-tmp:gh-pages
git branch -D gh-pages-tmp
gh api -X POST "repos/{owner}/$REPO/pages" -f source[branch]=gh-pages -f source[path]=/ 2>/dev/null || true
echo "Pages: https://$(gh api user --jq .login).github.io/$REPO/"
