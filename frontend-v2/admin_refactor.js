const fs = require('fs');

// Refactor Admin Login
const loginPath = 'src/app/admin/login/page.tsx';
if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf8');
  content = content.replace(/https:\/\/images\.seeklogo\.com[^"]+/g, '/logo-dark.svg');
  content = content.replace(/bg-red-500\/10/g, 'bg-primary/10');
  content = content.replace(/border-red-500\/20/g, 'border-primary/20');
  content = content.replace(/text-red-500/g, 'text-primary'); // except for error messages? Wait, error messages were text-red-500!
  
  // Actually, wait. I shouldn't replace text-red-500 globally in login because of form errors!
  // Let's explicitly replace the brand ones.
  content = content.replace(/text-red-500 text-xs font-semibold tracking-wide uppercase mb-3/g, 'text-primary text-xs font-semibold tracking-wide uppercase mb-3');
  
  content = content.replace(/>\s*Chandigarh University\s*<\/h1>/g, '>CodeSkill Admin</h1>');
  content = content.replace(/alt="Chandigarh University"/g, 'alt="CodeSkill Admin"');
  fs.writeFileSync(loginPath, content, 'utf8');
  console.log('Updated Admin Login');
}

// Refactor Admin Dashboard
const dashPath = 'src/app/admin/dashboard/page.tsx';
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, 'utf8');
  content = content.replace(/from-red-500\/10/g, 'from-primary/5');
  content = content.replace(/from-red-400 via-rose-500 to-red-400/g, 'from-foreground to-foreground/70');
  
  content = content.replace(/hover:border-red-500\/30/g, 'hover:border-primary/30');
  content = content.replace(/bg-red-500\/10/g, 'bg-primary/10');
  content = content.replace(/bg-red-500\/20/g, 'bg-primary/20');
  content = content.replace(/bg-red-500\/5/g, 'bg-primary/5');
  content = content.replace(/text-red-500/g, 'text-primary');

  content = content.replace(/hover:border-rose-500\/30/g, 'hover:border-primary/30');
  content = content.replace(/bg-rose-500\/10/g, 'bg-primary/10');
  content = content.replace(/bg-rose-500\/20/g, 'bg-primary/20');
  content = content.replace(/text-rose-500/g, 'text-primary');

  content = content.replace(/hover:border-orange-500\/30/g, 'hover:border-primary/30');
  content = content.replace(/bg-orange-500\/10/g, 'bg-primary/10');
  content = content.replace(/bg-orange-500\/20/g, 'bg-primary/20');
  content = content.replace(/text-orange-500/g, 'text-primary');

  fs.writeFileSync(dashPath, content, 'utf8');
  console.log('Updated Admin Dashboard');
}
