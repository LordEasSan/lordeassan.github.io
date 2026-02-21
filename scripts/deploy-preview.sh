#!/usr/bin/env bash
set -euo pipefail

BRANCH="$1"
SHA="$2"
EVENT="$3"

if [ -z "${GITHUB_REPOSITORY:-}" ]; then
  echo "GITHUB_REPOSITORY not set. This script is intended to run in GitHub Actions."
  exit 1
fi

OWNER="${GITHUB_REPOSITORY%%/*}"
REPO_NAME="${GITHUB_REPOSITORY##*/}"
PREVIEW_DIR="previews/${BRANCH}-${SHA:0:7}"

REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

TMPDIR=$(mktemp -d)
git clone --depth=1 "${REPO_URL}" "${TMPDIR}"
cd "${TMPDIR}"

if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
  git rm -rf . || true
fi

mkdir -p "${PREVIEW_DIR}"
rm -rf "${PREVIEW_DIR:?}"/* || true
cp -r "${GITHUB_WORKSPACE}/_site/." "${PREVIEW_DIR}/"

git add -A
if git diff --quiet --cached; then
  echo "No changes to commit for preview ${PREVIEW_DIR}"
else
  git -c user.name="github-actions[bot]" -c user.email="github-actions[bot]@users.noreply.github.com" commit -m "Preview deploy: ${BRANCH} ${SHA}"
  git push origin gh-pages
fi

echo "Preview deployed: https://${OWNER}.github.io/${REPO_NAME}/${PREVIEW_DIR}"
