#!/usr/bin/env bash

set -euo pipefail

# ---------------- CONFIG ----------------
NEW_NAME="Aarushi Kapoor"
NEW_EMAIL="aarushik250@gmail.com"
NEW_BRANCH="replayed-history"
TEMP_DIR="$(mktemp -d)"
# ---------------------------------------

echo "⚠️  This will rewrite history. Make sure you're in a SAFE repo copy."
read -p "Continue? (y/N): " confirm
[[ "$confirm" != "y" ]] && exit 1

# Ensure we're inside a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "❌ Not a git repository"
  exit 1
}

echo "📦 Collecting commit history..."

# Get commits in chronological order
git log --reverse --pretty=format:'%H|%ad|%s' --date=iso >"$TEMP_DIR/commits.txt"

echo "🌱 Creating new orphan branch..."
git checkout --orphan "$NEW_BRANCH"
git rm -rf . >/dev/null 2>&1 || true

# Iterate commits
while IFS='|' read -r HASH DATE MESSAGE; do
  echo "🔁 Replaying commit: $MESSAGE"

  # Checkout that commit's content into working dir
  git checkout "$HASH" -- . >/dev/null 2>&1

  # Stage all files
  git add .

  # Commit with new author but same date
  GIT_AUTHOR_NAME="$NEW_NAME" \
    GIT_AUTHOR_EMAIL="$NEW_EMAIL" \
    GIT_AUTHOR_DATE="$DATE" \
    GIT_COMMITTER_NAME="$NEW_NAME" \
    GIT_COMMITTER_EMAIL="$NEW_EMAIL" \
    GIT_COMMITTER_DATE="$DATE" \
    git commit -m "$MESSAGE" >/dev/null 2>&1 || {
    echo "⚠️ Skipped empty commit"
  }

done <"$TEMP_DIR/commits.txt"

echo "✅ Done! New branch: $NEW_BRANCH"

# Cleanup
rm -rf "$TEMP_DIR"

echo "🚀 You can now inspect with:"
echo "git log --pretty=fuller"
