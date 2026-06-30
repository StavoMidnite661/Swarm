const fs = require('fs');
const path = './src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-zinc-950\/60/g, 'bg-black/40');
content = content.replace(/border-white\/5/g, 'border-white/10');
content = content.replace(/bg-zinc-950\/90/g, 'bg-black/60 backdrop-blur-3xl');
content = content.replace(/bg-zinc-900/g, 'bg-black/80');
content = content.replace(/text-cyan-400/g, 'text-white/80');
content = content.replace(/bg-cyan-400/g, 'bg-white');

fs.writeFileSync(path, content);
console.log('App.tsx glassy update.');
