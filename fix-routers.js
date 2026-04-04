const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'frontend', 'src');

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

console.log('🔄 Fixing old react-router-dom hooks and Links to Next.js variants...');

let replaceCount = 0;

walkSync(SRC_DIR, (fullPath) => {
  if (!fullPath.match(/\.(tsx|ts)$/)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;

  // Replace react-router-dom imports
  if (content.includes('react-router-dom')) {
    const imports = [];
    
    // Check what was imported
    if (content.match(/\bLink\b/)) imports.push('Link');
    
    // Instead of parsing perfectly, let's just do text replacements
    content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1) => {
      let newImports = [];
      let navImports = [];
      let nextLinkImports = [];
      
      const parts = p1.split(',').map(p => p.trim()).filter(Boolean);
      for (const part of parts) {
        if (part === 'Link') nextLinkImports.push('Link');
        if (part === 'NavLink') nextLinkImports.push('Link as NavLink');
        if (part === 'useNavigate') navImports.push('useRouter');
        if (part === 'useLocation') navImports.push('usePathname');
        if (part === 'useParams') navImports.push('useParams');
        if (part === 'Outlet') newImports.push('/* Outlet -> children */');
        if (part === 'Navigate') navImports.push('redirect'); // not 1-1, but helps to not crash
      }

      let res = '';
      if (nextLinkImports.length) res += `import Link from 'next/link';\n`;
      if (navImports.length) res += `import { ${navImports.join(', ')} } from 'next/navigation';\n`;
      return res.trim();
    });

    // Replace Link syntax
    content = content.replace(/<Link([^>]*)\bto=/g, '<Link$1href=');
    content = content.replace(/<NavLink([^>]*)\bto=/g, '<NavLink$1href=');

    // Replace useNavigate syntax
    content = content.replace(/const\s+(\w+)\s*=\s*useNavigate\(\)/g, "const $1 = useRouter()");
    content = content.replace(/(\w+)\(['"]\/([^'"]+)['"]\)/g, (match, p1, p2) => {
      // Very naive router.push heuristic
      if (p1 === 'navigate') return `router.push('/${p2}')`;
      return match;
    });
    content = content.replace(/\bnavigate\(/g, 'router.push(');

    // Replace useLocation
    content = content.replace(/const\s+(\w+)\s*=\s*useLocation\(\)/g, "const pathname = usePathname()");
    content = content.replace(/location\.pathname/g, "pathname");

    // Replace Navigate component
    content = content.replace(/<Navigate\s+to=([^>]+)\s*\/?>/g, "/* redirect($1) */");

    hasChanges = true;
  }
  
  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    replaceCount++;
    console.log(`✅ Fixed router in: ${path.relative(SRC_DIR, fullPath)}`);
  }
});

console.log(`Done! Replaced router implementations in ${replaceCount} files.`);
