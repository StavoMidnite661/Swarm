const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix duplicates
content = content.replace(/backdrop-blur-3xl backdrop-blur-[a-z]+/g, 'backdrop-blur-3xl');
content = content.replace(/backdrop-blur-2xl backdrop-blur-[a-z]+/g, 'backdrop-blur-2xl');

// Remove harsh colors
content = content.replace(/bg-cyan-500\/15/g, 'bg-white/10');
content = content.replace(/border-cyan-500\/25/g, 'border-white/20');
content = content.replace(/hover:bg-cyan-500\/25/g, 'hover:bg-white/20');
content = content.replace(/bg-cyan-400/g, 'bg-white');
content = content.replace(/text-cyan-300/g, 'text-white/80');

// Fix bg-zinc
content = content.replace(/bg-zinc-800/g, 'bg-white/10');
content = content.replace(/bg-zinc-900\/50/g, 'bg-black/20');
content = content.replace(/bg-zinc-950\/50/g, 'bg-black/30');
content = content.replace(/border-zinc-800/g, 'border-white/10');
content = content.replace(/text-zinc-500/g, 'text-white/50');
content = content.replace(/text-zinc-400/g, 'text-white/60');
content = content.replace(/text-zinc-300/g, 'text-white/80');

// Replace font-sans font-light tracking-wide duplicates or weirdnesses
content = content.replace(/font-sans font-light tracking-wide font-sans/g, 'font-sans font-light tracking-wide');
content = content.replace(/font-sans font-light tracking-wide text-xs tracking-wide/g, 'font-sans font-light tracking-wide text-xs');
content = content.replace(/font-sans font-light text-xs tracking-wide tracking-wide/g, 'font-sans font-light tracking-wide text-xs');

// We want elegance
content = content.replace(/text-\[9px\]/g, 'text-[10px]');
content = content.replace(/text-\[8px\]/g, 'text-[10px]');

fs.writeFileSync(path, content);
console.log('Styles cleaned up.');
