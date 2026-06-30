const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/components/CommandCenter.tsx',
  'src/components/LeftPanel.tsx',
  'src/components/RightPanel.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace common colors
    content = content.replace(/bg-indigo-500\/[0-9]+/g, 'bg-white/5');
    content = content.replace(/border-indigo-[0-9]+\/[0-9]+/g, 'border-white/10');
    content = content.replace(/text-indigo-[0-9]+/g, 'text-white/80');
    content = content.replace(/bg-cyan-500\/[0-9]+/g, 'bg-white/10');
    content = content.replace(/border-cyan-[0-9]+\/[0-9]+/g, 'border-white/20');
    content = content.replace(/text-cyan-[0-9]+/g, 'text-white/90');
    content = content.replace(/bg-emerald-[0-9]+\/[0-9]+/g, 'bg-white/10');
    content = content.replace(/text-emerald-[0-9]+/g, 'text-white/80');
    content = content.replace(/bg-rose-[0-9]+\/[0-9]+/g, 'bg-white/10');
    content = content.replace(/border-rose-[0-9]+\/[0-9]+/g, 'border-white/20');
    content = content.replace(/text-rose-[0-9]+/g, 'text-white/80');
    content = content.replace(/text-purple-[0-9]+/g, 'text-white/80');
    content = content.replace(/bg-purple-[0-9]+\/[0-9]+/g, 'bg-white/10');
    content = content.replace(/border-purple-[0-9]+\/[0-9]+/g, 'border-white/20');
    
    // Some specific replacements
    content = content.replace(/from-indigo-[0-9]+\/[0-9]+/g, 'from-white/10');
    content = content.replace(/to-cyan-[0-9]+\/[0-9]+/g, 'to-white/5');
    content = content.replace(/from-cyan-[0-9]+\/[0-9]+/g, 'from-white/10');
    content = content.replace(/from-indigo-[0-9]+/g, 'from-white/10');
    content = content.replace(/to-cyan-[0-9]+/g, 'to-white/5');
    content = content.replace(/bg-gradient-to-[a-z] from-cyan-[0-9]+\/[0-9]+ to-indigo-[0-9]+\/[0-9]+/g, 'bg-white/[0.03]');
    
    // Shadows
    content = content.replace(/shadow-\[0_0_[0-9]+px_rgba\((6,182,212|99,102,241|16,185,129|244,63,94|236,72,153|245,158,11|139,92,246),0\.[0-9]+\)\]/g, 'shadow-[0_0_12px_rgba(255,255,255,0.1)]');
    content = content.replace(/shadow-\[0_0_[0-9]+px_#(22d3ee|34d399|fbbf24|f43f5e|818cf8|a78bfa)\]/g, 'shadow-[0_0_12px_rgba(255,255,255,0.15)]');

    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Done additional replacements.');
