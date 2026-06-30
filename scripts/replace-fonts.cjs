const fs = require('fs');

const file = 'src/components/WorkspaceConsole.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/font-mono/g, 'font-sans');

// Also remove tracking-widest/bold from headers if they look too aggressive
content = content.replace(/tracking-widest font-bold/g, 'tracking-widest font-semibold');
content = content.replace(/text-black text-black/g, 'text-black');
content = content.replace(/border-white\/40\/35/g, 'border-white/20');

fs.writeFileSync(file, content, 'utf8');

console.log('Done font replacement.');
