const fs = require('fs');
const path = require('path');

const replacements = [
  // CU Legacy Red -> Primary (Black/White semantic)
  { regex: /bg-\[#c8102e\]/g, replacement: 'bg-primary' },
  { regex: /hover:bg-\[#a90c25\]/g, replacement: 'hover:bg-primary/90' },
  { regex: /active:bg-\[#910b20\]/g, replacement: 'active:bg-primary/80' },
  { regex: /text-\[#c8102e\]/g, replacement: 'text-primary' },

  // Dark legacy backgrounds (often used in fixed dark components)
  { regex: /bg-\[#09090B\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#050505\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#121214\]/g, replacement: 'bg-card' },
  { regex: /bg-\[#18181B\]/g, replacement: 'bg-card' },
  { regex: /bg-\[#0D0D12\]/g, replacement: 'bg-muted/50' },
  { regex: /bg-\[#1e1e1e\]/g, replacement: 'bg-card' },
  { regex: /bg-\[#1e1e2e\]/g, replacement: 'bg-card' },
  { regex: /bg-\[#27272A\]/g, replacement: 'bg-muted' },
  { regex: /border-\[#27272A\]/g, replacement: 'border-border' },
  
  // Navbar & Landing specific hardcoded
  { regex: /bg-\[#FFFFFF\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#111111\]/g, replacement: 'bg-foreground' }, // Note: in some places #111111 was the CTA button.
  { regex: /text-\[#111111\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#171717\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#525252\]/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[#737373\]/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[#A3A3A3\]/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[#D4D4D4\]/g, replacement: 'text-foreground/90' },
  { regex: /text-\[#F5F5F5\]/g, replacement: 'text-background' },

  // Admin / Create Questions (Tailwind Slate/Gray hardcoded)
  { regex: /bg-gray-50/g, replacement: 'bg-muted/50' },
  { regex: /bg-gray-100/g, replacement: 'bg-muted' },
  { regex: /bg-slate-800/g, replacement: 'bg-card' },
  { regex: /bg-slate-900/g, replacement: 'bg-background' },
  { regex: /text-gray-900/g, replacement: 'text-foreground' },
  { regex: /text-gray-600/g, replacement: 'text-muted-foreground' },
  { regex: /text-slate-400/g, replacement: 'text-muted-foreground' },
  { regex: /text-slate-500/g, replacement: 'text-muted-foreground' },
  { regex: /border-gray-200/g, replacement: 'border-border' },
  { regex: /border-slate-700/g, replacement: 'border-border' },

  // Blue branding (replace with primary where appropriate, except for specific syntax highlighting)
  { regex: /bg-\[#2563EB\]/g, replacement: 'bg-primary' },
  { regex: /text-\[#2563EB\]/g, replacement: 'text-primary' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      replacements.forEach(({ regex, replacement }) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      });
      
      // Specifically for Navbar which has some very strict dark mode overrides
      if (fullPath.includes('Navbar.tsx') || fullPath.includes('Hero.tsx') || fullPath.includes('Result')) {
         // Also replace dark: prefixes to simplify if needed, but semantic tokens should just replace the literal hex.
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('src');
