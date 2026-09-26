const fs = require('fs');
const glob = require('glob'); // Not available by default, use recursive readdir

const fixFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // For files directly under src/module/ (depth 2)
  if (file.match(/src\/[^\/]+\/[^\/]+\.ts$/)) {
    if (content.includes("from '../../database")) {
      content = content.replace(/from '\.\.\/\.\.\/database/g, "from '../database");
      changed = true;
    }
    if (content.includes("from '../../redis")) {
      content = content.replace(/from '\.\.\/\.\.\/redis/g, "from '../redis");
      changed = true;
    }
  }

  // auth.module.ts type fix
  if (file.endsWith('auth.module.ts')) {
    content = content.replace(/secret: config.get<string>\('jwt.secret'\),/g, "secret: config.get<string>('jwt.secret') || 'default',");
    content = content.replace(/expiresIn: config.get<string>\('jwt.expiresIn'\)/g, "expiresIn: (config.get<string>('jwt.expiresIn') || '30d') as any");
    changed = true;
  }

  // jwt.strategy.ts type fix
  if (file.endsWith('jwt.strategy.ts')) {
    content = content.replace(/secretOrKey: configService.get<string>\('jwt.secret'\),/g, "secretOrKey: configService.get<string>('jwt.secret') || 'default',");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
};

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = dir + '/' + file;
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES') return;
    }
  });
  return filelist;
};

const files = walkSync('src');
files.filter(f => f.endsWith('.ts')).forEach(fixFile);
