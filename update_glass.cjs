const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

// Emojis to text/initials
content = content.replace(/avatar: '⚖'/g, "avatar: 'FI'");
content = content.replace(/avatar: '⚡'/g, "avatar: 'EN'");
content = content.replace(/avatar: '🛡'/g, "avatar: 'LE'");
content = content.replace(/avatar: '❖'/g, "avatar: 'OP'");

// Remove the max-height constraints from the main content areas so the scrolling takes up the whole central panel height
content = content.replace(/max-h-\[180px\]/g, 'max-h-full');
content = content.replace(/max-h-\[220px\]/g, 'max-h-full');
content = content.replace(/max-h-\[320px\]/g, 'max-h-full');
content = content.replace(/max-h-\[340px\]/g, 'max-h-full');

// Add more glassy aesthetics
// Right now it's often `bg-white/[0.04] backdrop-blur-3xl`
// Let's make it look like a clear coat paint job
content = content.replace(/bg-black\/50/g, 'bg-black/20 backdrop-blur-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border-white/10');
content = content.replace(/bg-black\/40/g, 'bg-black/10 backdrop-blur-2xl shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] border-white/10');
content = content.replace(/bg-white\/\[0\.04\] backdrop-blur-3xl/g, 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] border-t border-l border-white/20');
content = content.replace(/bg-white\/\[0\.03\] backdrop-blur-3xl/g, 'bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] border-t border-l border-white/10');
content = content.replace(/bg-white\/5 border border-white\/\[0\.08\]/g, 'bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]');

content = content.replace(/bg-white\/10 border border-white\/20/g, 'bg-white/10 border-t border-white/30 border-l border-white/20 border-b border-white/5 border-r border-white/5 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.2)]');

fs.writeFileSync(path, content);
console.log('Styles cleaned up.');
