const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-amber-\d+/g, replacement: 'bg-primary/10' },
  { regex: /border-amber-\d+/g, replacement: 'border-primary/20' },
  { regex: /text-amber-\d+/g, replacement: 'text-primary' },
  { regex: /text-amber-300/g, replacement: 'text-primary' },
  { regex: /text-amber-400/g, replacement: 'text-primary' },
  { regex: /text-amber-700/g, replacement: 'text-primary' },
  { regex: /bg-amber-50/g, replacement: 'bg-primary/5' },
  { regex: /bg-amber-100/g, replacement: 'bg-primary/10' },
  { regex: /border-amber-200/g, replacement: 'border-primary/20' },
  { regex: /border-amber-300/g, replacement: 'border-primary/30' },
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
        console.log(`Removed all amber from ${fullPath}`);
      }
    }
  }
}

processDirectory('src/app/admin/questions/create');
