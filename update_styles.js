const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-zinc-950\/80/g, 'bg-white/[0.03] backdrop-blur-3xl');
content = content.replace(/bg-zinc-950\/90/g, 'bg-white/[0.05] backdrop-blur-3xl');
content = content.replace(/bg-zinc-900\/80/g, 'bg-white/[0.03] backdrop-blur-2xl');
content = content.replace(/bg-zinc-900\/60/g, 'bg-white/[0.02] backdrop-blur-xl');
content = content.replace(/bg-zinc-950\/75/g, 'bg-white/[0.04] backdrop-blur-3xl');

content = content.replace(/border-cyan-500\/30/g, 'border-white/[0.08]');
content = content.replace(/border-cyan-500\/20/g, 'border-white/[0.06]');
content = content.replace(/border-cyan-500\/40/g, 'border-white/[0.12]');

content = content.replace(/text-cyan-400/g, 'text-white/90');
content = content.replace(/text-cyan-500/g, 'text-white/70');

// Typography
content = content.replace(/font-mono/g, 'font-sans font-light tracking-wide');
content = content.replace(/text-\[9px\]/g, 'text-xs');
content = content.replace(/text-\[8px\]/g, 'text-[10px]');
content = content.replace(/text-\[10px\]/g, 'text-xs');

// Shadows
content = content.replace(/shadow-\[0_0_15px_rgba\(34,211,238,0\.1\)\]/g, 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]');
content = content.replace(/shadow-\[0_0_20px_rgba\(6,182,212,0\.15\)\]/g, 'shadow-[0_8px_32px_rgba(0,0,0,0.2)]');

fs.writeFileSync(path, content);
console.log('Styles updated.');
