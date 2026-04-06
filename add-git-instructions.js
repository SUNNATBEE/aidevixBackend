const fs = require('fs');
const path = require('path');

const STUDENTS_DIR = path.join(__dirname, 'frontend', 'docs', 'students');

const injectionBlock = `
> 🛑 **DIQQAT: ASOSIY O'ZGARISHLAR! (O'QISH SHART)**
> Loyiha to'liq **Next.js va TypeScript** ga o'tkazildi! Eskirgan xatolarsiz ishlash uchun quyidagilarni bajaring:
> 
> **1.** Avval eng so'nggi \`main\` dagi o'zgarishlarni tortib oling (agar avval branch ochgan bo'lsangiz ham buni qiling):
> \`\`\`bash
> git fetch origin
> git checkout main
> git pull origin main
> \`\`\`
> **2.** Next.js parametrlarini va TypeScript paketlarini kompyuteringizga o'rnating:
> \`\`\`bash
> cd frontend
> npm install
> \`\`\`
> **3.** Loyihani ishga tushiring:
> \`\`\`bash
> npm run dev
> \`\`\`
> *(Eski Vite \`npm run start\` endi ishlamaydi!)*

`;

if (fs.existsSync(STUDENTS_DIR)) {
  const files = fs.readdirSync(STUDENTS_DIR).filter(file => file.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(STUDENTS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the block is already there
    if (!content.includes('🛑 **DIQQAT: ASOSIY O\'ZGARISHLAR!')) {
      // Find the end of the first line (the # Title)
      const firstLineEnd = content.indexOf('\n');
      if (firstLineEnd !== -1) {
        content = content.slice(0, firstLineEnd + 1) + injectionBlock + content.slice(firstLineEnd + 1);
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  });

  console.log('✅ Barcha 9 ta o\'quvchi fayllariga Git pull va NPM install qoidalari saqlandi!');
} else {
  console.log('❌ O\\'quvchilar papkasi topilmadi:', STUDENTS_DIR);
}
