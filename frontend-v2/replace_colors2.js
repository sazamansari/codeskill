const fs = require('fs');
const filePath = 'src/app/problems/[id]/page.tsx';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  const replacements = [
    { regex: /bg-\[#1E1E1E\]/g, replacement: 'bg-card' },
    { regex: /bg-\[#181818\]/g, replacement: 'bg-muted' },
    { regex: /bg-\[#121212\]/g, replacement: 'bg-background' },
    { regex: /bg-\[#141414\]/g, replacement: 'bg-background' },
    { regex: /text-\[#60A5FA\]/g, replacement: 'text-primary' },
    { regex: /text-\[#E5E7EB\]/g, replacement: 'text-foreground/90' },
    { regex: /accent-\[#2563EB\]/g, replacement: 'accent-primary' }
  ];
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated colors again in ${filePath}`);
}
