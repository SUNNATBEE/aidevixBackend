#!/bin/bash
# Aidevix — Auto memory update hook
# Muhim buyruqlar natijasini memory ga yozish uchun
# (Bu hook PostToolUse Bash da ishlaydi — faqat muhim natijalarda)

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Faqat test/lint/start/seed kabi muhim buyruqlarda ishlaydi
if [[ "$COMMAND" == *"npm run"* ]] || [[ "$COMMAND" == *"npm test"* ]]; then
  EXIT_CODE=$(echo "$INPUT" | jq -r '.tool_response.exit_code // "0"' 2>/dev/null)
  # npm test har doim 1 qaytaradi (no test framework) — bu normal
  if [[ "$COMMAND" == *"npm test"* ]] && [[ "$EXIT_CODE" == "1" ]]; then
    exit 0  # Normal holatda sessiya davom etsin
  fi
fi

exit 0
