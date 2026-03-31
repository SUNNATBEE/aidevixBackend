// Seed courses to production backend
const https = require('https');

// First login as admin to get token
const loginData = JSON.stringify({
  email: 'admin@aidevix.com',
  password: 'admin123'
});

function makeRequest(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'aidevix-backend-production.up.railway.app',
      port: 443,
      path: '/api' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const COURSES = [
  {
    title: "HTML & CSS asoslari",
    description: "Web dasturlashning poydevori. HTML tuzilishi, CSS stillar, responsive dizayn va zamonaviy web sahifalar yaratishni o'rganasiz.",
    category: "html",
    level: "beginner",
    price: 0,
    language: "O'zbek tili",
    requirements: ["Kompyuter va internet", "Kod yozish uchun VS Code", "Sabr va qiziquvchanlik"],
  },
  {
    title: "CSS Flexbox & Grid Master",
    description: "Zamonaviy CSS layout texnologiyalari. Flexbox va CSS Grid bilan murakkab sahifa tartiblarini osongina yarating.",
    category: "css",
    level: "beginner",
    price: 0,
    language: "O'zbek tili",
    requirements: ["HTML asoslarini bilish", "CSS asosiy tushunchalarini tushunish"],
  },
  {
    title: "JavaScript Full Course",
    description: "JavaScript dasturlash tilini noldan professional darajagacha. O'zgaruvchilar, funksiyalar, DOM, async/await va boshqalar.",
    category: "javascript",
    level: "beginner",
    price: 0,
    language: "O'zbek tili",
    requirements: ["HTML va CSS asoslarini bilish", "Mantiqiy fikrlash qobiliyati"],
  },
  {
    title: "JavaScript Advanced Patterns",
    description: "Closures, Prototypes, Design Patterns, Event Loop, Promises, Generators va boshqa ilg'or mavzular.",
    category: "javascript",
    level: "intermediate",
    price: 249000,
    language: "O'zbek tili",
    requirements: ["JavaScript asoslarini bilish", "ES6+ sintaksisini tushunish"],
  },
  {
    title: "React.js Frontend Development",
    description: "React komponentlari, Hooks, Context API, Redux Toolkit va zamonaviy React ekotizimi.",
    category: "react",
    level: "intermediate",
    price: 349000,
    language: "O'zbek tili",
    requirements: ["JavaScript yaxshi bilish", "ES6 modules, arrow functions"],
  },
  {
    title: "React Advanced — Next.js & SSR",
    description: "Server Side Rendering, Static Site Generation, API Routes, Next.js App Router va deployment.",
    category: "react",
    level: "advanced",
    price: 449000,
    language: "O'zbek tili",
    requirements: ["React asoslarini bilish", "Node.js haqida tushuncha"],
  },
  {
    title: "TypeScript Complete Guide",
    description: "TypeScript tiplar tizimi, generics, decorators, utility types va React bilan TypeScript ishlatish.",
    category: "typescript",
    level: "intermediate",
    price: 199000,
    language: "O'zbek tili",
    requirements: ["JavaScript yaxshi bilish", "OOP tushunchalarini bilish"],
  },
  {
    title: "Node.js Backend Development",
    description: "Express.js, MongoDB, REST API, Authentication, File upload va real-time dasturlash.",
    category: "nodejs",
    level: "intermediate",
    price: 399000,
    language: "O'zbek tili",
    requirements: ["JavaScript asoslarini bilish", "HTTP va API tushunchalari"],
  },
];

async function main() {
  console.log('🔑 Admin bilan login qilinmoqda...');
  
  // Try to login as admin
  const loginRes = await makeRequest('POST', '/auth/login', loginData);
  
  if (!loginRes.data.success) {
    console.log('❌ Admin login xato:', loginRes.data.message);
    console.log('Admin yo\'q bo\'lishi mumkin. Avval admin yaratish kerak.');
    
    // Try to register admin
    console.log('📝 Admin yaratilmoqda...');
    const regRes = await makeRequest('POST', '/auth/register', JSON.stringify({
      username: 'aidevix_admin',
      email: 'admin@aidevix.com',
      password: 'Admin123!'
    }));
    
    if (regRes.data.success) {
      console.log('✅ Admin yaratildi');
      // Note: need to manually set role to admin in DB
      // For now, try creating courses without admin token
      const token = regRes.data.data.accessToken;
      await createCourses(token);
    } else {
      console.log('❌ Register xato:', regRes.data.message);
      // Try login with different password
      const login2 = await makeRequest('POST', '/auth/login', JSON.stringify({
        email: 'admin@aidevix.com',
        password: 'Admin123!'
      }));
      if (login2.data.success) {
        console.log('✅ Admin login muvaffaqiyatli');
        await createCourses(login2.data.data.accessToken);
      } else {
        console.log('❌ Login ham xato:', login2.data.message);
      }
    }
    return;
  }
  
  console.log('✅ Admin login muvaffaqiyatli');
  const token = loginRes.data.data.accessToken;
  await createCourses(token);
}

async function createCourses(token) {
  console.log(`\n📚 ${COURSES.length} ta kurs qo'shilmoqda...\n`);
  
  for (const course of COURSES) {
    const res = await makeRequest('POST', '/courses', JSON.stringify(course), token);
    if (res.status === 201 || res.data.success) {
      console.log(`  ✅ ${course.title}`);
    } else {
      console.log(`  ❌ ${course.title} — ${res.data.message || res.status}`);
    }
  }
  
  // Verify
  const check = await makeRequest('GET', '/courses?limit=10');
  console.log(`\n📊 Jami kurslar: ${check.data?.data?.pagination?.total || 0}`);
}

main().catch(console.error);
