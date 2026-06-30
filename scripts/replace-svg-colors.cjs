const fs = require('fs');

const file = 'src/components/CentralPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// SVG Colors
content = content.replace(/fill-(cyan|purple|amber|emerald|indigo|rose)-[0-9]+\/[0-9]+/g, 'fill-white/10');
content = content.replace(/fill-rose-950\/40/g, 'fill-white/5');
content = content.replace(/stroke-(cyan|purple|amber|emerald|indigo|rose)-[0-9]+\/[0-9]+/g, 'stroke-white/20');
content = content.replace(/stroke-(cyan|purple|amber|emerald|indigo|rose)-[0-9]+/g, 'stroke-white/40');
content = content.replace(/fill-(cyan|purple|amber|emerald|indigo|rose)-[0-9]+/g, 'fill-white/80');

content = content.replace(/from-indigo-500/g, 'from-white/40');
content = content.replace(/to-cyan-400/g, 'to-white/10');
content = content.replace(/accent-indigo-400/g, 'accent-white');

fs.writeFileSync(file, content, 'utf8');

const wcFile = 'src/components/WorkspaceConsole.tsx';
let wcContent = fs.readFileSync(wcFile, 'utf8');
wcContent = wcContent.replace(/from-indigo-500\/5/g, 'from-white/5');
fs.writeFileSync(wcFile, wcContent, 'utf8');

console.log('Done SVG colors.');
