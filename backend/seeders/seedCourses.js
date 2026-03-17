/**
 * Aidevix — Kurslar Seed Data
 * Barcha 7 ta kurs uchun real ma'lumotlar va loyihalar.
 *
 * Ishlatish:
 *   node backend/seeders/seedCourses.js
 *
 * DIQQAT: Bu fayl mavjud ma'lumotlarni tozalab qayta yozadi.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Course   = require('../models/Course');
const Video    = require('../models/Video');
const Project  = require('../models/Project');
const User     = require('../models/User');
const bcrypt   = require('bcryptjs');

const connectDB = require('../config/database');

// ─────────────────────────────────────────────────────────────────────────────
// KURSLAR MA'LUMOTLARI
// ─────────────────────────────────────────────────────────────────────────────
const COURSES = [
  {
    key: 'html',
    title: 'HTML Asoslari: Noldan Professionallikkacha',
    description: 'HTML teglar, atributlar, semantik elementlar, formalar, jadvallar va zamonaviy HTML5 elementlarini o\'rganasiz. Veb-sahifalarning asosi — HTML ni to\'liq egallash.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg',
    price: 99000,
    isFree: false,
    category: 'html',
    level: 'beginner',
    rating: 4.7,
    ratingCount: 1240,
    studentsCount: 5820,
    viewCount: 18500,
    totalDuration: 18000,
    videos: [
      { title: '1-Dars: HTML nima? Brauzer qanday ishlaydi?', description: 'Veb qanday ishlashi, HTML va brauzerning o\'zaro munosabati.', order: 0, duration: 720 },
      { title: '2-Dars: Birinchi HTML sahifa', description: '!DOCTYPE, html, head, body teglar. VS Code sozlamasi.', order: 1, duration: 900 },
      { title: '3-Dars: Matn teglari (h1-h6, p, span, div)', description: 'Sarlavhalar, paragraflar, inline va block elementlar.', order: 2, duration: 1080 },
      { title: '4-Dars: Havolalar va rasmlar (a, img)', description: 'href, src atributlar, nisbiy va mutlaq yo\'llar.', order: 3, duration: 960 },
      { title: '5-Dars: Ro\'yxatlar (ul, ol, li)', description: 'Tartibli va tartibsiz ro\'yxatlar, ichma-ich ro\'yxatlar.', order: 4, duration: 840 },
      { title: '6-Dars: Jadvallar (table, tr, td, th)', description: 'Oddiy va murakkab jadvallar, colspan, rowspan.', order: 5, duration: 1200 },
      { title: '7-Dars: Formalar (form, input, button)', description: 'Input turlari, placeholder, required, form validation.', order: 6, duration: 1440 },
      { title: '8-Dars: Semantik HTML5 elementlar', description: 'header, nav, main, section, article, footer elementlari.', order: 7, duration: 1080 },
      { title: '9-Dars: Multimedia (video, audio, iframe)', description: 'HTML5 media elementlari, YouTube embed.', order: 8, duration: 960 },
      { title: '10-Dars: Meta teglar va SEO asoslari', description: 'meta charset, viewport, description, og: teglar.', order: 9, duration: 840 },
    ],
    projects: [
      {
        title: 'Shaxsiy Portfolio Sahifasi',
        description: 'O\'z portfolio sahifangizni HTML bilan yarating. Haqingizda ma\'lumot, ko\'nikmalar va loyihalar bo\'limi bo\'lsin.',
        level: 'beginner',
        order: 0,
        technologies: ['HTML5'],
        requirements: ['1-10 darslarni ko\'ring'],
        estimatedTime: 120,
        xpReward: 300,
        tasks: [
          { order: 0, title: 'index.html fayl yarating', description: 'Asosiy HTML strukturasini yozing', hint: '<!DOCTYPE html> bilan boshlang', xpReward: 30 },
          { order: 1, title: 'Navigation bar qo\'shing', description: 'nav tegi bilan navigatsiya yarating', hint: '<nav> ichida <ul> va <li> ishlatishingiz mumkin', xpReward: 30 },
          { order: 2, title: 'Hero section', description: 'Ismingiz va kasbingiz ko\'rsating', hint: 'h1, p, img teglardan foydalaning', xpReward: 30 },
          { order: 3, title: 'Ko\'nikmalar bo\'limi', description: 'O\'z ko\'nikmalaringizni ro\'yxat sifatida ko\'rsating', hint: 'ul/li yoki table ishlatishingiz mumkin', xpReward: 30 },
          { order: 4, title: 'Aloqa formasi', description: 'Ism, email, xabar inputlari bilan forma yarating', hint: 'form, input, textarea, button teglar', xpReward: 30 },
        ],
      },
      {
        title: 'Restoran Menyu Sahifasi',
        description: 'Restoran uchun to\'liq menyu sahifasini yarating. Jadval va rasmlar bilan to\'liq HTML sahifa.',
        level: 'beginner',
        order: 1,
        technologies: ['HTML5'],
        requirements: ['Jadval darsini ko\'ring'],
        estimatedTime: 90,
        xpReward: 250,
        tasks: [
          { order: 0, title: 'Menyu sahifasi strukturasi', description: 'header, main, footer yarating', hint: 'Semantik elementlar ishlating', xpReward: 50 },
          { order: 1, title: 'Jadval bilan menyu', description: 'Ovqat nomi, narxi va tavsifi jadval bilan ko\'rsating', hint: 'table, thead, tbody, tr, td ishlatang', xpReward: 50 },
          { order: 2, title: 'Rasm va tavsif qo\'shing', description: 'Har bir ovqat uchun rasm va qisqacha tavsif', hint: 'img tag src va alt atributlarini to\'ldiring', xpReward: 50 },
        ],
      },
    ],
  },

  {
    key: 'css',
    title: 'CSS Stillar va Zamonaviy Dizayn',
    description: 'CSS selektorlar, Flexbox, Grid, animatsiyalar va responsive dizayn. Chiroyli va zamonaviy sahifalar yaratishni o\'rganasiz. Hammasini amaliyot bilan.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
    price: 129000,
    isFree: false,
    category: 'css',
    level: 'beginner',
    rating: 4.8,
    ratingCount: 890,
    studentsCount: 4210,
    viewCount: 14300,
    totalDuration: 21600,
    videos: [
      { title: '1-Dars: CSS qo\'llash usullari (inline, internal, external)', description: 'CSS fayl ulash, cascade va specificity.', order: 0, duration: 840 },
      { title: '2-Dars: Selektorlar (element, class, id, pseudo)', description: ':hover, :focus, :first-child va boshqa pseudo-selektorlar.', order: 1, duration: 1080 },
      { title: '3-Dars: Ranglar va Tipografiya', description: 'color, font-family, font-size, line-height, Google Fonts.', order: 2, duration: 960 },
      { title: '4-Dars: Box Model (margin, padding, border)', description: 'Box model tushunchasi, element o\'lchamlari, box-sizing.', order: 3, duration: 1200 },
      { title: '5-Dars: Display va Positioning', description: 'block, inline, flex, grid, position: relative/absolute/fixed.', order: 4, duration: 1440 },
      { title: '6-Dars: Flexbox to\'liq kurs', description: 'justify-content, align-items, flex-wrap, flex-grow, order.', order: 5, duration: 1800 },
      { title: '7-Dars: CSS Grid Layout', description: 'grid-template-columns/rows, gap, grid-area, auto-fit/auto-fill.', order: 6, duration: 1800 },
      { title: '8-Dars: Responsive dizayn va Media Queries', description: '@media breakpoints, mobile-first dizayn, fluid layout.', order: 7, duration: 1440 },
      { title: '9-Dars: CSS Animatsiyalar va Transitions', description: 'transition, animation, @keyframes, transform.', order: 8, duration: 1320 },
      { title: '10-Dars: CSS Variables va Custom Properties', description: '--variable, :root, calc(), clamp() funksiyalar.', order: 9, duration: 960 },
      { title: '11-Dars: Zamonaviy CSS (Glass morphism, Neumorphism)', description: 'backdrop-filter, clip-path, modern design patterns.', order: 10, duration: 1200 },
    ],
    projects: [
      {
        title: 'Responsive Landing Page',
        description: 'Zamonaviy va to\'liq responsive landing page yarating. Mobile, tablet va desktop uchun moslashgan.',
        level: 'beginner',
        order: 0,
        technologies: ['HTML5', 'CSS3'],
        requirements: ['Flexbox va Grid darslarini ko\'ring'],
        estimatedTime: 180,
        xpReward: 400,
        tasks: [
          { order: 0, title: 'Hero section yarating', description: 'Full-screen hero background bilan', hint: 'background-image, min-height: 100vh', xpReward: 80 },
          { order: 1, title: 'Flexbox navigatsiya', description: 'Logo + Links + Button bir qatorda', hint: 'display: flex; justify-content: space-between', xpReward: 80 },
          { order: 2, title: 'Grid kurs kartalar', description: '3 ustunli kurs kartalar', hint: 'display: grid; grid-template-columns: repeat(3, 1fr)', xpReward: 80 },
          { order: 3, title: 'Media query qo\'shing', description: 'Mobil uchun 1 ustunli ko\'rinish', hint: '@media (max-width: 768px)', xpReward: 80 },
          { order: 4, title: 'Hover animatsiyalar', description: 'Kartalar hover'da ko\'tarilsin', hint: 'transition: transform 0.3s; transform: translateY(-5px)', xpReward: 80 },
        ],
      },
      {
        title: 'Login Forma Dizayni',
        description: 'Zamonaviy va chiroyli login/register forma dizayni yarating. Glassmorphism effect bilan.',
        level: 'intermediate',
        order: 1,
        technologies: ['HTML5', 'CSS3'],
        requirements: ['CSS animatsiyalar darsini ko\'ring'],
        estimatedTime: 90,
        xpReward: 300,
        tasks: [
          { order: 0, title: 'Glass morphism karta', description: 'backdrop-filter: blur() bilan shisha effekt', hint: 'background: rgba(255,255,255,0.1); backdrop-filter: blur(10px)', xpReward: 60 },
          { order: 1, title: 'Input stillar', description: 'Fokusda border-color o\'zgarsin', hint: 'input:focus { outline: none; border-color: #6366f1; }', xpReward: 60 },
          { order: 2, title: 'Gradient button', description: 'Hover'da gradient o\'zgarsin', hint: 'background: linear-gradient(); transition: all 0.3s', xpReward: 60 },
        ],
      },
    ],
  },

  {
    key: 'tailwind',
    title: 'Tailwind CSS: Tez va Professional UI',
    description: 'Utility-first CSS framework. Tez va professional UI yaratish. Dark mode, responsive dizayn, custom komponentlar va Tailwind CSS v3.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
    price: 149000,
    isFree: false,
    category: 'css',
    level: 'intermediate',
    rating: 4.9,
    ratingCount: 650,
    studentsCount: 2980,
    viewCount: 9800,
    totalDuration: 16200,
    videos: [
      { title: '1-Dars: Tailwind nima? O\'rnatish va sozlash', description: 'CDN vs npm, tailwind.config.js, PostCSS setup.', order: 0, duration: 900 },
      { title: '2-Dars: Utility class mantiqini tushunish', description: 'Tailwind ning asosiy kontseptsiyasi, class nomlash qoidalari.', order: 1, duration: 1080 },
      { title: '3-Dars: Ranglar, Matn va Spacing', description: 'text-*, bg-*, p-*, m-*, rounded, shadow classlar.', order: 2, duration: 960 },
      { title: '4-Dars: Flexbox va Grid (Tailwind bilan)', description: 'flex, grid, justify-*, items-*, gap-* classlar.', order: 3, duration: 1200 },
      { title: '5-Dars: Responsive dizayn (sm, md, lg, xl)', description: 'Breakpoint prefix, mobile-first approach.', order: 4, duration: 1080 },
      { title: '6-Dars: Dark Mode', description: 'dark: prefix, class strategy, custom dark colors.', order: 5, duration: 960 },
      { title: '7-Dars: Hover, Focus va boshqa States', description: 'hover:, focus:, active:, group-hover: pseudoclass prefix.', order: 6, duration: 840 },
      { title: '8-Dars: Custom Components (@apply)', description: 'CSS layers, @apply directive, component class yaratish.', order: 7, duration: 1080 },
      { title: '9-Dars: Tailwind bilan Real UI yaratish', description: 'Navbar, Card, Modal, Button komponentlar.', order: 8, duration: 1800 },
    ],
    projects: [
      {
        title: 'Dashboard UI',
        description: 'Admin dashboard sahifasini Tailwind CSS bilan yarating. Dark mode qo\'llab-quvvatlansin.',
        level: 'intermediate',
        order: 0,
        technologies: ['HTML5', 'Tailwind CSS'],
        requirements: ['Responsive va Dark Mode darslarini ko\'ring'],
        estimatedTime: 150,
        xpReward: 350,
        tasks: [
          { order: 0, title: 'Sidebar navigation', description: 'Fixed sidebar ikonkalar va menyu bilan', hint: 'fixed inset-y-0 left-0 w-64 bg-gray-900', xpReward: 70 },
          { order: 1, title: 'Stats kartalar (4 ta)', description: 'Har biri xil rang va ikonka', hint: 'grid grid-cols-4 gap-6', xpReward: 70 },
          { order: 2, title: 'Data jadval', description: 'Tailwind bilan chiroyli jadval', hint: 'table-auto w-full border-collapse', xpReward: 70 },
          { order: 3, title: 'Dark mode toggle', description: 'Bir tugma bilan dark/light almashtirish', hint: 'document.documentElement.classList.toggle("dark")', xpReward: 70 },
        ],
      },
    ],
  },

  {
    key: 'javascript',
    title: 'JavaScript: Asoslaridan Ilg\'or Darajagacha',
    description: 'JavaScript o\'zgaruvchilar, funksiyalar, massivlar, ob\'ektlar, ES6+ sintaksis, asinxron JS (Promises, async/await), DOM va Fetch API. Amaliyot bilan puxta o\'rganasiz.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
    price: 299000,
    isFree: false,
    category: 'javascript',
    level: 'beginner',
    rating: 4.9,
    ratingCount: 2100,
    studentsCount: 8940,
    viewCount: 28700,
    totalDuration: 36000,
    videos: [
      { title: '1-Dars: JavaScript nima? Konsol bilan tanishuv', description: 'console.log, typeof, browser console, Node.js.', order: 0, duration: 780 },
      { title: '2-Dars: O\'zgaruvchilar (var, let, const)', description: 'Scope, hoisting, temporal dead zone.', order: 1, duration: 1080 },
      { title: '3-Dars: Ma\'lumot turlari va Type Coercion', description: 'String, Number, Boolean, null, undefined, Symbol, BigInt.', order: 2, duration: 1200 },
      { title: '4-Dars: Operatorlar va Shartlar (if, switch)', description: 'Arifmetik, taqqoslash, mantiqiy operatorlar. Ternary.', order: 3, duration: 1080 },
      { title: '5-Dars: Sikllar (for, while, for...of, for...in)', description: 'Iteratsiya, break, continue, nested loops.', order: 4, duration: 1200 },
      { title: '6-Dars: Funksiyalar (Declaration, Expression, Arrow)', description: 'Parameters, return, default values, rest params.', order: 5, duration: 1440 },
      { title: '7-Dars: Massivlar va Metodlar', description: 'map, filter, reduce, forEach, find, some, every, flat.', order: 6, duration: 1800 },
      { title: '8-Dars: Ob\'ektlar va Destrukturizatsiya', description: 'Object methods, spread, rest, optional chaining.', order: 7, duration: 1440 },
      { title: '9-Dars: DOM Manipulation', description: 'querySelector, addEventListener, classList, innerHTML.', order: 8, duration: 1800 },
      { title: '10-Dars: ES6+ Zamonaviy Sintaksis', description: 'Template literals, modules, Set, Map, WeakMap.', order: 9, duration: 1200 },
      { title: '11-Dars: Promises va Async/Await', description: 'Callback hell, Promise chain, async function, error handling.', order: 10, duration: 1800 },
      { title: '12-Dars: Fetch API va HTTP So\'rovlar', description: 'GET, POST, headers, JSON, error handling, loading states.', order: 11, duration: 1440 },
      { title: '13-Dars: OOP JavaScript (Class, Inheritance)', description: 'class, constructor, extends, super, static methods.', order: 12, duration: 1620 },
      { title: '14-Dars: Error Handling va Debugging', description: 'try/catch/finally, custom errors, debugger, VS Code debugging.', order: 13, duration: 1080 },
    ],
    projects: [
      {
        title: 'Todo Ilovasi',
        description: 'To\'liq funksional Todo ilovasi yarating. Qo\'shish, o\'chirish, tahrirlash va localStorage da saqlash.',
        level: 'beginner',
        order: 0,
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        requirements: ['DOM manipulation va localStorage darsini ko\'ring'],
        estimatedTime: 180,
        xpReward: 500,
        tasks: [
          { order: 0, title: 'Vazifalar qo\'shish', description: 'Input va button bilan yangi vazifa qo\'shing', hint: 'addEventListener("click") va innerHTML += ishlatang', xpReward: 100 },
          { order: 1, title: 'Bajarildi belgilash', description: 'Checkbox bilan vazifani tugatildi deb belgilash', hint: 'classList.toggle("completed")', xpReward: 100 },
          { order: 2, title: 'O\'chirish funksiyasi', description: 'Har bir vazifa yonida delete tugmasi', hint: 'closest(".todo-item").remove()', xpReward: 100 },
          { order: 3, title: 'localStorage saqlash', description: 'Sahifa yangilananda ma\'lumotlar saqlansin', hint: 'localStorage.setItem("todos", JSON.stringify(todos))', xpReward: 100 },
          { order: 4, title: 'Filter (Hammasi/Bajarilgan/Bajarilmagan)', description: '3 ta tab bilan filterlash', hint: 'filter() method ishlatang', xpReward: 100 },
        ],
      },
      {
        title: 'Ob\'havo Ilovasi (Weather App)',
        description: 'OpenWeatherMap API dan foydalanib shahar ob\'havosini ko\'rsating. Fetch API bilan.',
        level: 'intermediate',
        order: 1,
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Fetch API'],
        requirements: ['Fetch API va Async/Await darsini ko\'ring'],
        estimatedTime: 150,
        xpReward: 450,
        tasks: [
          { order: 0, title: 'API ulanishi', description: 'OpenWeatherMap API kalitini oling va ulanish testi', hint: 'fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)', xpReward: 150 },
          { order: 1, title: 'Ma\'lumotlarni ko\'rsatish', description: 'Harorat, namlik, shamol tezligi ko\'rsatish', hint: 'data.main.temp, data.wind.speed', xpReward: 150 },
          { order: 2, title: 'Loading va xato holatlari', description: 'Yuklash paytida spinner, xato bo\'lsa xabar', hint: 'try/catch/finally', xpReward: 150 },
        ],
      },
      {
        title: 'Kalkulyator',
        description: 'To\'liq funksional kalkulyator. Standart arifmetik amallar + klaviatura qo\'llab-quvvatlanishi.',
        level: 'intermediate',
        order: 2,
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        requirements: ['Hodisalar va DOM manipulation darsini ko\'ring'],
        estimatedTime: 120,
        xpReward: 400,
        tasks: [
          { order: 0, title: 'UI yaratish', description: 'Display va tugmalar joylashishi', hint: 'CSS Grid bilan 4x4 tugmalar', xpReward: 100 },
          { order: 1, title: 'Hisoblash mantiqini yozing', description: 'Amal operatorlari va eval yoki manual hisoblash', hint: 'eval() yoki switch/case bilan amallar', xpReward: 150 },
          { order: 2, title: 'Klaviatura qo\'llab-quvvatlash', description: 'Raqamlar va operatorlarni klaviaturadan kiritish', hint: 'document.addEventListener("keydown", e => {...})', xpReward: 150 },
        ],
      },
    ],
  },

  {
    key: 'react',
    title: 'React.js: Zamonaviy Frontend Dasturlash',
    description: 'React hooks (useState, useEffect, useContext, useMemo, useCallback), komponentlar, React Router v6, API integratsiya va production-ready ilovalar yaratish. Real loyihalar bilan.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    price: 349000,
    isFree: false,
    category: 'react',
    level: 'intermediate',
    rating: 4.9,
    ratingCount: 3100,
    studentsCount: 11200,
    viewCount: 35600,
    totalDuration: 43200,
    videos: [
      { title: '1-Dars: React nima? Virtual DOM tushunchasi', description: 'React tarixi, SPA, Virtual DOM, React vs Vanilla JS.', order: 0, duration: 900 },
      { title: '2-Dars: Create React App va Vite bilan loyiha yaratish', description: 'CRA vs Vite, fayl struktura, npm/yarn/pnpm.', order: 1, duration: 1080 },
      { title: '3-Dars: JSX sintaksisi', description: 'JSX nima, JS ichida HTML, expressions, fragments.', order: 2, duration: 960 },
      { title: '4-Dars: Komponentlar (Function Components)', description: 'Props, children, default props, component composition.', order: 3, duration: 1200 },
      { title: '5-Dars: useState Hook', description: 'State nima, useState sintaksisi, state yangilash, re-render.', order: 4, duration: 1440 },
      { title: '6-Dars: useEffect Hook', description: 'Lifecycle, dependency array, cleanup function.', order: 5, duration: 1620 },
      { title: '7-Dars: Hodisalar (Events) va Formalar', description: 'onClick, onChange, onSubmit, controlled inputs.', order: 6, duration: 1200 },
      { title: '8-Dars: Ro\'yxatlar va Shartli Render', description: 'map() bilan ro\'yxatlar, key prop, &&, ternary.', order: 7, duration: 1080 },
      { title: '9-Dars: useContext va Context API', description: 'Context yaratish, Provider, Consumer, useContext.', order: 8, duration: 1440 },
      { title: '10-Dars: useRef va useMemo', description: 'DOM reference, mutable ref, memoization, performance.', order: 9, duration: 1200 },
      { title: '11-Dars: Custom Hooks', description: 'useFetch, useLocalStorage, useForm custom hook yaratish.', order: 10, duration: 1440 },
      { title: '12-Dars: React Router v6', description: 'BrowserRouter, Routes, Route, Link, useNavigate, useParams.', order: 11, duration: 1800 },
      { title: '13-Dars: API integratsiya (Axios)', description: 'Axios, interceptors, loading states, error handling.', order: 12, duration: 1620 },
      { title: '14-Dars: React Query (TanStack Query)', description: 'useQuery, useMutation, staleTime, cache invalidation.', order: 13, duration: 1800 },
      { title: '15-Dars: Performance Optimization', description: 'React.memo, useCallback, code splitting, lazy loading.', order: 14, duration: 1440 },
    ],
    projects: [
      {
        title: 'Blog Ilovasi',
        description: 'To\'liq blog ilovasi. Maqolalar ro\'yxati, detail sahifasi, qidiruv va kategoriyalar.',
        level: 'intermediate',
        order: 0,
        technologies: ['React', 'React Router', 'Axios', 'CSS Modules'],
        requirements: ['React Router va API integration darslarini ko\'ring'],
        estimatedTime: 240,
        xpReward: 600,
        tasks: [
          { order: 0, title: 'Loyiha strukturasini yozing', description: 'pages/, components/, hooks/, api/ papkalarni yarating', hint: 'Har bir sahifa uchun alohida fayl', xpReward: 100 },
          { order: 1, title: 'Maqolalar ro\'yxati (Home page)', description: 'JSONPlaceholder API dan maqolalar oling', hint: 'useEffect + axios.get("https://jsonplaceholder.typicode.com/posts")', xpReward: 150 },
          { order: 2, title: 'Maqola detail sahifasi', description: 'useParams() bilan id olip maqola ko\'rsating', hint: 'useParams(); axios.get(`/posts/${id}`)', xpReward: 150 },
          { order: 3, title: 'Qidiruv funksiyasi', description: 'Sarlavha bo\'yicha real-time filterlash', hint: 'useState + filter() method', xpReward: 100 },
          { order: 4, title: 'Loading va Error states', description: 'Yuklanayotganda skeleton, xatoda error UI', hint: 'isLoading, isError state bilan shartli render', xpReward: 100 },
        ],
      },
      {
        title: 'Movie Search App',
        description: 'OMDB API yordamida kino qidiruv ilovasi. Sevimlilar ro\'yxati localStorage da saqlansin.',
        level: 'intermediate',
        order: 1,
        technologies: ['React', 'Custom Hooks', 'localStorage'],
        requirements: ['Custom Hooks va useRef darslarini ko\'ring'],
        estimatedTime: 200,
        xpReward: 550,
        tasks: [
          { order: 0, title: 'Search komponenti', description: 'Debounced qidiruv input yarating', hint: 'setTimeout + clearTimeout bilan debounce', xpReward: 150 },
          { order: 1, title: 'Kino kartalar grid', description: 'Poster, sarlavha, yil va reyting ko\'rsating', hint: 'CSS Grid yoki Tailwind grid', xpReward: 150 },
          { order: 2, title: 'Sevimlilar xususiyati', description: 'Yulduzcha bilan sevimlilarga qo\'shish/olib tashlash', hint: 'useLocalStorage custom hook yarating', xpReward: 150 },
          { order: 3, title: 'Sevimlilar sahifasi', description: 'Saqlangan kinolar alohida sahifada ko\'rsatilsin', hint: 'React Router ile /favorites route', xpReward: 100 },
        ],
      },
    ],
  },

  {
    key: 'redux',
    title: 'Redux Toolkit: Murakkab State Boshqaruvi',
    description: 'Redux Toolkit, createSlice, createAsyncThunk, RTK Query, middleware va persist. Katta React ilovalarida global state professional boshqarish.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Redux.png',
    price: 199000,
    isFree: false,
    category: 'react',
    level: 'advanced',
    rating: 4.8,
    ratingCount: 780,
    studentsCount: 3450,
    viewCount: 10200,
    totalDuration: 25200,
    videos: [
      { title: '1-Dars: Redux nima? Context vs Redux', description: 'Global state muammosi, Redux arxitekturasi.', order: 0, duration: 1080 },
      { title: '2-Dars: Redux Toolkit o\'rnatish', description: 'configureStore, Provider, DevTools.', order: 1, duration: 900 },
      { title: '3-Dars: createSlice va Reducers', description: 'initialState, reducers, actions, immer.', order: 2, duration: 1440 },
      { title: '4-Dars: useSelector va useDispatch', description: 'Store dan ma\'lumot olish va action yuborish.', order: 3, duration: 1200 },
      { title: '5-Dars: createAsyncThunk', description: 'Asinxron amallar, pending/fulfilled/rejected states.', order: 4, duration: 1800 },
      { title: '6-Dars: RTK Query', description: 'createApi, useGetQuery, useMutation, auto caching.', order: 5, duration: 2160 },
      { title: '7-Dars: Redux Persist', description: 'localStorage saqlash, whitelist/blacklist, rehydrate.', order: 6, duration: 1080 },
      { title: '8-Dars: Selectors va Memoization', description: 'createSelector, reselect, performance.', order: 7, duration: 1200 },
      { title: '9-Dars: Middleware va Logger', description: 'Custom middleware, redux-logger, action tracking.', order: 8, duration: 960 },
    ],
    projects: [
      {
        title: 'E-Commerce Savatchasi',
        description: 'To\'liq shopping cart ilovasi. Mahsulot qo\'shish, miqdor o\'zgartirish, jami narx hisoblash.',
        level: 'intermediate',
        order: 0,
        technologies: ['React', 'Redux Toolkit', 'RTK Query'],
        requirements: ['createSlice va createAsyncThunk darslarini ko\'ring'],
        estimatedTime: 300,
        xpReward: 700,
        tasks: [
          { order: 0, title: 'productSlice yarating', description: 'Mahsulotlar ro\'yxati va tanlangan kategoriya', hint: 'createSlice({ name: "products", ... })', xpReward: 140 },
          { order: 1, title: 'cartSlice yarating', description: 'Savatcha: addItem, removeItem, updateQuantity, clear', hint: 'Immer bilan state mutatsiya qilish', xpReward: 140 },
          { order: 2, title: 'RTK Query bilan API', description: 'FakeStore API dan mahsulotlar olish', hint: 'createApi({ baseUrl: "https://fakestoreapi.com" })', xpReward: 140 },
          { order: 3, title: 'Savatcha hisoblash', description: 'Jami narx va tovarlar soni selector bilan', hint: 'createSelector(selectCart, cart => cart.reduce(...))', xpReward: 140 },
          { order: 4, title: 'Redux Persist qo\'shing', description: 'Cart savatcha localStorage da saqlansin', hint: 'persistReducer + persistStore', xpReward: 140 },
        ],
      },
    ],
  },

  {
    key: 'nodejs',
    title: 'Node.js: Backend Dasturlash',
    description: 'Node.js, Express.js, MongoDB, JWT autentifikatsiya, REST API, middleware, fayl yuklash va production deployment. To\'liq backend dasturlashni o\'rganasiz.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',
    price: 399000,
    isFree: false,
    category: 'nodejs',
    level: 'intermediate',
    rating: 4.8,
    ratingCount: 1560,
    studentsCount: 6780,
    viewCount: 21400,
    totalDuration: 50400,
    videos: [
      { title: '1-Dars: Node.js nima? O\'rnatish va birinchi server', description: 'Node.js arxitekturasi, event loop, CommonJS modullar.', order: 0, duration: 1080 },
      { title: '2-Dars: npm va package.json', description: 'npm, nodemon, scripts, devDependencies.', order: 1, duration: 900 },
      { title: '3-Dars: Express.js asoslari', description: 'Router, Request, Response, next(), middleware zanjiri.', order: 2, duration: 1440 },
      { title: '4-Dars: REST API yaratish (CRUD)', description: 'GET, POST, PUT, DELETE, status kodlar, JSON response.', order: 3, duration: 1800 },
      { title: '5-Dars: Middleware (express.json, cors, morgan)', description: 'Built-in va third-party middleware, custom middleware.', order: 4, duration: 1200 },
      { title: '6-Dars: MongoDB va Mongoose', description: 'Schema, Model, CRUD operatsiyalar, Mongoose methods.', order: 5, duration: 2160 },
      { title: '7-Dars: Environment Variables va dotenv', description: '.env fayl, process.env, secrets management.', order: 6, duration: 720 },
      { title: '8-Dars: JWT Autentifikatsiya', description: 'JWT nima, sign, verify, access + refresh tokens.', order: 7, duration: 2160 },
      { title: '9-Dars: Bcrypt — Parol Shifrlash', description: 'Hash yaratish, compare, salt rounds.', order: 8, duration: 900 },
      { title: '10-Dars: Fayl Yuklash (Multer)', description: 'Rasm yuklash, fayl tekshiruvi, Cloudinary integratsiya.', order: 9, duration: 1440 },
      { title: '11-Dars: Error Handling Middleware', description: 'Global error handler, custom error class, async wrapper.', order: 10, duration: 1080 },
      { title: '12-Dars: Validation (express-validator / Joi)', description: 'Input tekshiruv, sanitization, custom validatorlar.', order: 11, duration: 1200 },
      { title: '13-Dars: Rate Limiting va Security', description: 'express-rate-limit, helmet, CORS, SQL injection himoya.', order: 12, duration: 1080 },
      { title: '14-Dars: Deployment (Render, Railway)', description: 'Production sozlamalar, environment, CI/CD basics.', order: 13, duration: 1440 },
    ],
    projects: [
      {
        title: 'Blog REST API',
        description: 'To\'liq blog uchun REST API. Maqolalar, foydalanuvchilar, kommentariyalar va JWT autentifikatsiya.',
        level: 'intermediate',
        order: 0,
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
        requirements: ['MongoDB va JWT darslarini ko\'ring'],
        estimatedTime: 360,
        xpReward: 800,
        tasks: [
          { order: 0, title: 'Express server yarating', description: 'Basic Express app, PORT, middleware qo\'shing', hint: 'express(), cors(), express.json()', xpReward: 100 },
          { order: 1, title: 'MongoDB ulanishi', description: 'Mongoose connect, User va Post modellar', hint: 'mongoose.connect(process.env.MONGODB_URI)', xpReward: 150 },
          { order: 2, title: 'Auth endpoints', description: 'POST /auth/register va POST /auth/login', hint: 'bcrypt.hash() parol, jwt.sign() token', xpReward: 200 },
          { order: 3, title: 'Post CRUD endpoints', description: 'GET, POST, PUT, DELETE /api/posts', hint: 'authenticate middleware qo\'shing', xpReward: 200 },
          { order: 4, title: 'Postman bilan test qiling', description: 'Barcha endpointlarni Postman da sinab ko\'ring', hint: 'Auth header: Bearer <token>', xpReward: 150 },
        ],
      },
      {
        title: 'Foydalanuvchi Boshqarish API',
        description: 'Admin panel uchun foydalanuvchi CRUD API. Rasm yuklash, role boshqaruvi va pagination.',
        level: 'advanced',
        order: 1,
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'Multer'],
        requirements: ['Multer va Validation darslarini ko\'ring'],
        estimatedTime: 300,
        xpReward: 700,
        tasks: [
          { order: 0, title: 'User CRUD', description: 'GET /users (pagination), PUT /users/:id, DELETE /users/:id', hint: 'skip, limit bilan pagination', xpReward: 200 },
          { order: 1, title: 'Avatar yuklash', description: 'Multer bilan profil rasmi yuklash', hint: 'multer({ storage: diskStorage() })', xpReward: 200 },
          { order: 2, title: 'Role asosida himoya', description: 'requireAdmin middleware yarating', hint: 'if (req.user.role !== "admin") return 403', xpReward: 150 },
          { order: 3, title: 'Input validation', description: 'Barcha input maydonlarni tekshiring', hint: 'express-validator yoki Joi', xpReward: 150 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function seedData() {
  try {
    await connectDB();
    console.log('✅ Database ulandi');

    // Admin foydalanuvchi yaratish yoki topish
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        username: 'aidevix_admin',
        email: 'admin@aidevix.com',
        password: 'Admin@123456',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin yaratildi:', admin.email);
    } else {
      console.log('✅ Admin topildi:', admin.email);
    }

    // Mavjud kurslarni o'chirish
    await Project.deleteMany({});
    await Video.deleteMany({});
    await Course.deleteMany({});
    console.log('🗑️  Eski ma\'lumotlar tozalandi');

    // Har bir kursni yaratish
    for (const courseData of COURSES) {
      const { videos: videoDefs, projects: projectDefs, key, ...courseFields } = courseData;

      // Kurs yaratish
      const course = await Course.create({
        ...courseFields,
        instructor: admin._id,
        isActive: true,
      });

      // Videolar yaratish
      const videoIds = [];
      for (const videoDef of videoDefs) {
        const video = await Video.create({
          ...videoDef,
          course: course._id,
          isActive: true,
        });
        videoIds.push(video._id);
      }

      // Kursga videolarni ulash
      course.videos = videoIds;
      course.totalDuration = videoDefs.reduce((s, v) => s + v.duration, 0);
      await course.save();

      // Loyihalar yaratish
      for (const projDef of projectDefs) {
        await Project.create({
          ...projDef,
          courseId: course._id,
          isActive: true,
        });
      }

      console.log(`✅ [${courseData.category.toUpperCase()}] ${course.title} — ${videoDefs.length} video, ${projectDefs.length} loyiha`);
    }

    console.log('\n🎉 Barcha ma\'lumotlar muvaffaqiyatli yaratildi!');
    console.log(`   Kurslar: ${COURSES.length} ta`);
    console.log(`   Admin: admin@aidevix.com / Admin@123456`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed xatosi:', err.message);
    process.exit(1);
  }
}

seedData();
