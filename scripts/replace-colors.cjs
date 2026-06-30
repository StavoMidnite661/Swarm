const fs = require('fs');

let content = fs.readFileSync('src/components/WorkspaceConsole.tsx', 'utf8');

// Replace indigo
content = content.replace(/bg-indigo-500\/10/g, 'bg-white/5');
content = content.replace(/border-indigo-500\/25/g, 'border-white/15');
content = content.replace(/text-indigo-400/g, 'text-white/80');
content = content.replace(/border-indigo-500\/30/g, 'border-white/20');
content = content.replace(/text-indigo-300/g, 'text-white/70');
content = content.replace(/border-indigo-500/g, 'border-white/40');
content = content.replace(/bg-indigo-500\/5/g, 'bg-white/5');
content = content.replace(/bg-indigo-500\/25/g, 'bg-white/10');
content = content.replace(/border-indigo-500\/35/g, 'border-white/20');
content = content.replace(/hover:bg-indigo-500\/35/g, 'hover:bg-white/20');
content = content.replace(/bg-indigo-500/g, 'bg-white text-black');
content = content.replace(/text-black/g, 'text-black'); // already has text-black sometimes
content = content.replace(/hover:bg-indigo-400/g, 'hover:bg-white/80');
content = content.replace(/border-indigo-500\/45/g, 'border-white/30');
content = content.replace(/bg-indigo-950\/10/g, 'bg-white/5');
content = content.replace(/bg-indigo-400/g, 'bg-white/80');

// Replace cyan
content = content.replace(/bg-cyan-500\/15/g, 'bg-white/10');
content = content.replace(/border-cyan-500\/30/g, 'border-white/20');
content = content.replace(/text-cyan-300/g, 'text-white/90');
content = content.replace(/border-cyan-500/g, 'border-white/40');
content = content.replace(/bg-cyan-500\/5/g, 'bg-white/5');
content = content.replace(/bg-cyan-500\/25/g, 'bg-white/10');
content = content.replace(/border-cyan-500\/35/g, 'border-white/20');
content = content.replace(/hover:bg-cyan-500\/35/g, 'hover:bg-white/20');
content = content.replace(/bg-cyan-500/g, 'bg-white text-black');
content = content.replace(/hover:bg-cyan-400/g, 'hover:bg-white/80');

// Replace emerald
content = content.replace(/bg-emerald-500\/10/g, 'bg-white/10');
content = content.replace(/text-emerald-300/g, 'text-white/80');
content = content.replace(/border-emerald-500\/20/g, 'border-white/15');

// Replace rose
content = content.replace(/hover:bg-rose-500\/10/g, 'hover:bg-white/10');
content = content.replace(/hover:border-rose-500\/20/g, 'hover:border-white/20');
content = content.replace(/hover:text-rose-400/g, 'hover:text-white/80');
content = content.replace(/bg-rose-500\/10/g, 'bg-white/10');
content = content.replace(/border-rose-500\/30/g, 'border-white/20');
content = content.replace(/bg-rose-600/g, 'bg-white/20');
content = content.replace(/hover:bg-rose-500/g, 'hover:bg-white/30');

fs.writeFileSync('src/components/WorkspaceConsole.tsx', content, 'utf8');
console.log('Done');
