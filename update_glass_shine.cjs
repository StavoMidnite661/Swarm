const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

// Enhance the glassy shine!
content = content.replace(/bg-gradient-to-br from-white\/10 to-white\/5 backdrop-blur-3xl shadow-\[inset_0_0_40px_rgba\(255,255,255,0\.05\),0_8px_32px_rgba\(0,0,0,0\.5\)\] border-t border-l border-white\/20/g, 'bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 border-t-white/40');

content = content.replace(/bg-gradient-to-b from-white\/10 to-transparent border border-white\/10 backdrop-blur-xl shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.2\)\]/g, 'bg-gradient-to-b from-white/10 to-white/5 border border-white/10 border-t-white/30 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]');

fs.writeFileSync(path, content);
console.log('Glass enhanced.');
