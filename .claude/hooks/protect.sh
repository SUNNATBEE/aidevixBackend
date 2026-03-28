#!/bin/bash
# Aidevix — Fayl himoyasi hook
# Xavfli/muhim fayllarga yozishni bloklaydi

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

if [ -z "$FILE" ]; then
  exit 0
fi

# Himoyalangan fayllar / pattern lar
PROTECTED=(
  ".env"
  "package-lock.json"
  "yarn.lock"
  "pnpm-lock.yaml"
  "bun.lockb"
  ".git/"
  "render.yaml"
)

for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE" == *"$pattern"* ]]; then
    echo "🚫 BLOKLANDI: '$FILE' himoyalangan fayl ($pattern)" >&2
    echo "Agar o'zgartirish kerak bo'lsa, bevosita editor dan qiling." >&2
    exit 2
  fi
done

exit 0
