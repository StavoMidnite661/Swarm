const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/border border-white\/20 border-t-white\/40 border border-white\/10/g, 'border border-white/10 border-t-white/30 border-l-white/20');
content = content.replace(/border border-white\/10 border-t-white\/30 backdrop-blur-xl shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.3\)\]/g, 'border border-white/10 border-t-white/30 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]');
content = content.replace(/border-t border-l border-white\/10 border border-white\/\[0\.08\]/g, 'border border-white/[0.08] border-t-white/20 border-l-white/10');

fs.writeFileSync(path, content);
console.log('Borders cleaned.');
