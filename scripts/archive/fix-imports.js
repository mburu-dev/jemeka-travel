const fs = require('fs');
const path = require('path');

function replaceImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;
      if (content.includes('@/components')) {
        content = content.replace(/@\/components/g, '@jemeka/ui/components');
        modified = true;
      }
      if (content.includes('@/lib')) {
        content = content.replace(/@\/lib/g, '@jemeka/ui/lib');
        modified = true;
      }
      if (content.includes('@/providers/trpc')) {
        content = content.replace(/@\/providers\/trpc/g, '@/providers/trpc');
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

replaceImports(path.join(__dirname, 'apps/web/src'));
replaceImports(path.join(__dirname, 'packages/ui/src'));
