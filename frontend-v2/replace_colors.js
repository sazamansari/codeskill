const fs = require('fs');

const filePaths = [
  'src/app/problems/[id]/page.tsx'
];

let replacements = [
  { regex: /bg-\[#0B1220\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#0F172A\]/g, replacement: 'bg-card' },
  { regex: /bg-\[#131E32\]/g, replacement: 'bg-muted/50' },
  { regex: /bg-\[#172033\]/g, replacement: 'bg-secondary' },
  { regex: /bg-\[#1E293B\]/g, replacement: 'bg-accent' },
  { regex: /hover:bg-\[#1E293B\]/g, replacement: 'hover:bg-accent' },
  { regex: /text-\[#F8FAFC\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#CBD5E1\]/g, replacement: 'text-foreground/80' },
  { regex: /text-\[#94A3B8\]/g, replacement: 'text-muted-foreground' },
  { regex: /border-white\/\[0\.08\]/g, replacement: 'border-border' },
  { regex: /border-white\/\[0\.06\]/g, replacement: 'border-border/50' },
  { regex: /bg-white\/\[0\.04\]/g, replacement: 'bg-accent/50' },
  { regex: /bg-white\/\[0\.06\]/g, replacement: 'bg-accent' },
  { regex: /bg-white\/\[0\.07\]/g, replacement: 'bg-muted' },
  { regex: /bg-white\/\[0\.08\]/g, replacement: 'bg-muted' },
  { regex: /text-\[#3B82F6\]/g, replacement: 'text-primary' },
  { regex: /text-\[#2563EB\]/g, replacement: 'text-primary' },
  { regex: /bg-\[#2563EB\]/g, replacement: 'bg-primary' },
  { regex: /hover:bg-\[#3B82F6\]/g, replacement: 'hover:bg-primary/90' },
  { regex: /border-\[#2563EB\]\/30/g, replacement: 'border-primary/30' },
  { regex: /border-\[#2563EB\]\/60/g, replacement: 'border-primary/60' },
  { regex: /bg-\[#2563EB\]\/15/g, replacement: 'bg-primary/15' },
  { regex: /text-\[#93C5FD\]/g, replacement: 'text-primary' }
];

filePaths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
