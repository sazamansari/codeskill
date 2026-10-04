const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-amber-[56]00\/(\d+)/g, replacement: 'bg-primary/$1' },
  { regex: /bg-amber-[56]00/g, replacement: 'bg-primary' },
  { regex: /text-amber-[56]00\/(\d+)/g, replacement: 'text-primary/$1' },
  { regex: /text-amber-[56]00/g, replacement: 'text-primary' },
  { regex: /border-amber-[56]00\/(\d+)/g, replacement: 'border-primary/$1' },
  { regex: /border-amber-[56]00/g, replacement: 'border-primary' },
  { regex: /ring-amber-[56]00\/(\d+)/g, replacement: 'ring-primary/$1' },
  { regex: /ring-amber-[56]00/g, replacement: 'ring-primary' },
  { regex: /shadow-amber-[56]00\/(\d+)/g, replacement: 'shadow-primary/$1' },
  { regex: /shadow-amber-[56]00/g, replacement: 'shadow-primary' },
  { regex: /from-amber-[56]00/g, replacement: 'from-primary' },
  { regex: /to-amber-[56]00/g, replacement: 'to-primary' },
  { regex: /via-amber-[56]00/g, replacement: 'via-primary' },
  { regex: /hover:text-amber-[56]00/g, replacement: 'hover:text-primary' },
  { regex: /hover:bg-amber-[56]00\/(\d+)/g, replacement: 'hover:bg-primary/$1' },
  { regex: /hover:bg-amber-[56]00/g, replacement: 'hover:bg-primary/90' },
  { regex: /text-zinc-950/g, replacement: 'text-primary-foreground' },
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

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Removed amber from ${fullPath}`);
      }
    }
  }
}

processDirectory('src/app/admin/questions/create');
