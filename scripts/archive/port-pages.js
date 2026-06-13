const fs = require('fs');
const path = require('path');

const sourcePagesDir = path.join(__dirname, 'app/src/pages');
const targetAppDir = path.join(__dirname, 'apps/web/src/app');

const pagesToPort = [
  { file: 'Home.tsx', route: 'page.tsx' },
  { file: 'About.tsx', route: 'about/page.tsx' },
  { file: 'Contact.tsx', route: 'contact/page.tsx' },
  { file: 'Destinations.tsx', route: 'destinations/page.tsx' },
  { file: 'DestinationDetail.tsx', route: 'destinations/[slug]/page.tsx' },
  { file: 'Packages.tsx', route: 'packages/page.tsx' },
  { file: 'PackageDetail.tsx', route: 'packages/[slug]/page.tsx' },
  { file: 'Testimonials.tsx', route: 'testimonials/page.tsx' },
  { file: 'Admin.tsx', route: 'admin/page.tsx' },
  { file: 'Login.tsx', route: 'login/page.tsx' }
];

for (const page of pagesToPort) {
  const sourcePath = path.join(sourcePagesDir, page.file);
  const targetPath = path.join(targetAppDir, page.route);
  
  if (fs.existsSync(sourcePath)) {
    let content = fs.readFileSync(sourcePath, 'utf-8');
    
    // Replace react-router with next/link and next/navigation
    content = content.replace(/import\s+\{([^}]*)\}\s+from\s+["']react-router["'];?/g, (match, imports) => {
      let nextImports = '';
      if (imports.includes('Link')) {
        nextImports += `import Link from 'next/link';\n`;
      }
      if (imports.includes('useParams') || imports.includes('useNavigate') || imports.includes('useLocation')) {
        nextImports += `import { useParams, useRouter, usePathname } from 'next/navigation';\n`;
      }
      return nextImports;
    });

    // Replace Link 'to' with 'href'
    content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');
    
    // Replace useNavigate with useRouter
    content = content.replace(/useNavigate\(\)/g, 'useRouter()');

    // Make sure directory exists
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    
    // We need 'use client' since they use hooks (trpc, framer-motion, etc.)
    if (content.includes('useQuery') || content.includes('useRouter') || content.includes('useState') || content.includes('framer-motion')) {
      content = '"use client";\n\n' + content;
    }

    fs.writeFileSync(targetPath, content);
    console.log(`Ported ${page.file} to ${page.route}`);
  } else {
    console.warn(`Source file not found: ${sourcePath}`);
  }
}
