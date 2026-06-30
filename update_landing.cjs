const fs = require('fs');
const path = './src/components/LandingPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors
content = content.replace(/text-cyan-400/g, 'text-white/80');
content = content.replace(/text-cyan-500/g, 'text-white/70');
content = content.replace(/border-cyan-900\/30/g, 'border-white/10');
content = content.replace(/border-cyan-900\/40/g, 'border-white/10');
content = content.replace(/border-cyan-900\/50/g, 'border-white/10');
content = content.replace(/border-cyan-500\/40/g, 'border-white/20');
content = content.replace(/bg-cyan-500\/10/g, 'bg-white/10');
content = content.replace(/bg-cyan-500\/50/g, 'bg-white/30');
content = content.replace(/bg-cyan-500/g, 'bg-white');

content = content.replace(/bg-\[#03060D\]\/80/g, 'bg-black/30 backdrop-blur-2xl');
content = content.replace(/bg-\[#020408\]/g, 'bg-white/5');
content = content.replace(/bg-\[#02050A\]\/70/g, 'bg-black/20');
content = content.replace(/bg-\[#02050A\]\/50/g, 'bg-black/20');
content = content.replace(/selection:bg-cyan-500\/30/g, 'selection:bg-white/20');
content = content.replace(/from-cyan-500 via-orange-400 to-orange-500/g, 'from-white/20 to-white/10 bg-white/10 backdrop-blur-md');

content = content.replace(/text-green-500/g, 'text-emerald-400');
content = content.replace(/bg-green-500/g, 'bg-emerald-400');

// Typography
content = content.replace(/text-\[9px\] font-mono/g, 'text-[10px] font-sans font-light tracking-wide');
content = content.replace(/text-\[8px\] font-mono/g, 'text-[10px] font-sans font-light tracking-wide');
content = content.replace(/font-mono/g, 'font-sans font-light tracking-wide');

content = content.replace(/shadow-\[0_4px_20px_rgba\(0,0,0,0\.5\)\]/g, 'shadow-2xl shadow-black/50');
content = content.replace(/shadow-\[0_0_8px_rgba\(34,197,94,0\.8\)\]/g, 'shadow-[0_0_8px_rgba(52,211,153,0.5)]');
content = content.replace(/shadow-\[0_0_8px_rgba\(34,211,238,0\.8\)\]/g, 'shadow-[0_0_8px_rgba(255,255,255,0.5)]');

fs.writeFileSync(path, content);
console.log('LandingPage styles cleaned up.');
