const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND_DIR = path.join(__dirname, 'frontend');
const SRC_DIR = path.join(FRONTEND_DIR, 'src');
const APP_DIR = path.join(SRC_DIR, 'app');

console.log('🚀 Migrating to Next.js + TypeScript...');

// 1. Update package.json
console.log('📦 Updating package.json...');
const packageJsonPath = path.join(FRONTEND_DIR, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

pkg.scripts = {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
};

// Add Next.js and TS dependencies
pkg.dependencies = {
  ...pkg.dependencies,
  "next": "14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
};

delete pkg.dependencies["react-router-dom"];

pkg.devDependencies = {
  ...pkg.devDependencies,
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "typescript": "^5",
  "eslint": "^8",
  "eslint-config-next": "14.2.0"
};

delete pkg.devDependencies["vite"];
delete pkg.devDependencies["@vitejs/plugin-react"];

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));

// 2. Create Next.js configs
console.log('⚙️ Creating config files...');
fs.writeFileSync(path.join(FRONTEND_DIR, 'next.config.mjs'), `/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;`);

fs.writeFileSync(path.join(FRONTEND_DIR, 'tsconfig.json'), `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`);

// 3. Move old files to delete
console.log('🗑️ Cleaning up Vite files...');
const filesToDelete = ['index.html', 'vite.config.js', 'src/main.jsx', 'src/App.jsx', 'src/router'];
filesToDelete.forEach(file => {
  const fullPath = path.join(FRONTEND_DIR, ...file.split('/'));
  if (fs.existsSync(fullPath)) {
    if (fs.statSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
});

// 4. Create App Router structure
console.log('📂 Organizing App Router...');
if (!fs.existsSync(APP_DIR)) fs.mkdirSync(APP_DIR, { recursive: true });

// layout.tsx
fs.writeFileSync(path.join(APP_DIR, 'layout.tsx'), `import '../styles/index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aidevix',
  description: 'Kelajak kasbini O\\'zbek tilida o\\'rganing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}`);

// 5. Convert pages to app directory
const PAGES_DIR = path.join(SRC_DIR, 'pages');
if (fs.existsSync(PAGES_DIR)) {
  const pageFiles = fs.readdirSync(PAGES_DIR).filter(file => file.endsWith('.jsx') || file.endsWith('.tsx'));
  
  const pageMap = {
    'HomePage.jsx': 'page.tsx',
    'LoginPage.jsx': 'login/page.tsx',
    'RegisterPage.jsx': 'register/page.tsx',
    'ProfilePage.jsx': 'profile/page.tsx',
    'CoursesPage.jsx': 'courses/page.tsx',
    'CourseDetailPage.jsx': 'courses/[id]/page.tsx',
    'LeaderboardPage.jsx': 'leaderboard/page.tsx',
    'LevelUpPage.jsx': 'level-up/page.tsx',
  };

  for (const file of pageFiles) {
    if (pageMap[file]) {
      const destPath = path.join(APP_DIR, pageMap[file]);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.renameSync(path.join(PAGES_DIR, file), destPath);
      
      // Update the file extension to tsx and rename imports
      let content = fs.readFileSync(destPath, 'utf8');
      content = content.replace(/'react-router-dom'/g, "'next/navigation'");
      content = content.replace(/useNavigate/g, 'useRouter');
      content = `'use client';\n\n` + content;
      fs.writeFileSync(destPath, content);
    }
  }
}

// 6. Rename remaining .jsx to .tsx in components
const walkSync = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkSync(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
};

console.log('🔄 Converting .jsx to .tsx...');
walkSync(SRC_DIR, (fullPath) => {
  if (fullPath.endsWith('.jsx')) {
    const newPath = fullPath.replace(/\.jsx$/, '.tsx');
    fs.renameSync(fullPath, newPath);
  } else if (fullPath.endsWith('.js') && !fullPath.includes('node_modules')) {
    const newPath = fullPath.replace(/\.js$/, '.ts');
    fs.renameSync(fullPath, newPath);
  }
});

console.log('✅ Migration folder structure ready!');
console.log('👉 Now run matching npm installs:');
console.log('cd frontend && npm install && npm run build');
