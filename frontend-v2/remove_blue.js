const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-blue-[456]00\/(\d+)/g, replacement: 'bg-primary/$1' },
  { regex: /bg-blue-[456]00/g, replacement: 'bg-primary' },
  { regex: /text-blue-[456]00\/(\d+)/g, replacement: 'text-primary/$1' },
  { regex: /text-blue-[456]00/g, replacement: 'text-primary' },
  { regex: /border-blue-[456]00\/(\d+)/g, replacement: 'border-primary/$1' },
  { regex: /border-blue-[456]00/g, replacement: 'border-primary' },
  { regex: /ring-blue-[456]00\/(\d+)/g, replacement: 'ring-primary/$1' },
  { regex: /ring-blue-[456]00/g, replacement: 'ring-primary' },
  { regex: /shadow-blue-[456]00\/(\d+)/g, replacement: 'shadow-primary/$1' },
  { regex: /shadow-blue-[456]00/g, replacement: 'shadow-primary' },
  { regex: /from-blue-[456]00/g, replacement: 'from-primary' },
  { regex: /to-blue-[456]00/g, replacement: 'to-primary' },
  { regex: /via-blue-[456]00/g, replacement: 'via-primary' },
  { regex: /hover:text-blue-[456]00/g, replacement: 'hover:text-primary' },
  { regex: /hover:bg-blue-[456]00\/(\d+)/g, replacement: 'hover:bg-primary/$1' },
  { regex: /hover:bg-blue-[456]00/g, replacement: 'hover:bg-primary' },
  { regex: /group-hover:text-blue-[456]00/g, replacement: 'group-hover:text-primary' },
  { regex: /accent-\[#2563EB\]/g, replacement: 'accent-primary' },
  // specific remaining hex
  { regex: /#2563EB/ig, replacement: '#111111' }, // Defaulting remaining #2563EB to black for light mode or primary semantic.
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Specially for globals.css
      if (fullPath.endsWith('globals.css')) {
         content = content.replace(/--accent: 221 83% 53%;/g, '--accent: 0 0% 7%;');
         content = content.replace(/--ring: 221 83% 53%;/g, '--ring: 0 0% 7%;');
         // dark mode replacements
         content = content.replace(/--accent: 0 0% 14%;/g, '--accent: 0 0% 93%;');
         content = content.replace(/--ring: 0 0% 80%;/g, '--ring: 0 0% 93%;');
         modified = true;
      }

      replacements.forEach(({ regex, replacement }) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Removed blue from ${fullPath}`);
      }
    }
  }
}

processDirectory('src');
