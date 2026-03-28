#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Aidevix — Fayl himoyasi hook (Claude Code uchun)
# ══════════════════════════════════════════════════════════════

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.command // empty' 2>/dev/null)

if [ -z "$FILE" ]; then
  exit 0
fi

# Admin (o'qituvchi) uchun skip
if [ -f ".backend-admin" ]; then
  exit 0
fi

# Xatolik xabari funksiyasi
show_error() {
  local target=$1
  local reason=$2
  echo "" >&2
  echo "════════════════════════════════════════════════════════════════" >&2
  echo "🚫 XATOLIK: '$target' O'ZGARTIRISH BLOKLANDI!" >&2
  echo "════════════════════════════════════════════════════════════════" >&2
  echo "" >&2
  echo "⚠️  SABABI:" >&2
  echo "   $reason" >&2
  echo "" >&2
  echo "🛠️  NIMA QILISH KERAK?" >&2
  echo "   1. Faqat 'frontend/src/' papkasida ishlang." >&2
  echo "   2. Backend API ni o'zgartirmang, faqat undan foydalaning." >&2
  echo "   3. Agar backendda xato topsangiz, O'qituvchiga xabar bering." >&2
  echo "" >&2
  echo "📖 Qoidalar: STUDENTS.md faylini o'qing." >&2
  echo "════════════════════════════════════════════════════════════════" >&2
  echo "" >&2
}

# ─── 1. Backend papka himoyasi ───────────────────────────────
if [[ "$FILE" == *"backend/"* ]] || [[ "$FILE" == *"backend\\"* ]]; then
  show_error "$FILE" "Backend kodi (Node.js/Express) faqat O'qituvchi tomonidan boshqariladi. O'quvchilar frontendni o'rganishlari uchun backend barqaror bo'lishi shart."
  exit 2
fi

# ─── 2. Himoya qoidalarini o'zidan himoya qilish ─────────────
PROTECTED_FILES=(
  "package.json"
  "railway.toml"
  "architecture.md"
  "CLAUDE.md"
  "CLAUDE-details.md"
  "STUDENTS.md"
  "PROMPT_RULES.md"
  ".claudeignore"
  ".gitignore"
  ".cursorrules"
  ".cursorignore"
  "setup-protection.sh"
  ".backend-admin"
  ".githooks"
  ".claude"
  ".github"
)

BASENAME=$(basename "$FILE")
for protected in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE" == *"$protected"* ]] && [[ "$FILE" != *"frontend/"* ]] && [[ "$FILE" != *"frontend\\"* ]]; then
    show_error "$protected" "Loyiha xavfsizligi va himoya qoidalarini o'zgartirish qat'iyan man etiladi. Bu qoidalar jamoaviy ishlashni tartibga soladi."
    exit 2
  fi
done

exit 0
