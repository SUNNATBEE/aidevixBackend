#!/bin/bash
# Aidevix — Himoya tizimini o'rnatish
# Faqat o'qituvchi tomonidan ishga tushiriladi yoki npm install da ishlaydi

echo "🛡️ Aidevix Backend Himoyasini o'rnatish..."

# 1. Git hooks papkasini sozlash
git config core.hooksPath .githooks

# 2. Hooklarga ruxsat berish
chmod +x .githooks/pre-commit 2>/dev/null || true
chmod +x .claude/hooks/protect.sh 2>/dev/null || true

# 3. .backend-admin tekshiruvi (faqat o'qituvchida bo'ladi)
if [ -f ".backend-admin" ]; then
    echo "✅ Siz o'qituvchi (admin) darajasini tasdiqladingiz."
else
    echo "⚠️  O'quvchi darajasi: Backend himoyasi faollashtirildi."
fi

echo "✅ Tayyor! Endi AI va Git backend fayllarni o'zgartirishga yo'l qo'ymaydi."
