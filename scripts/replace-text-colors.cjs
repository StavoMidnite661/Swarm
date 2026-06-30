const fs = require('fs');

const files = [
  'src/components/CentralPanel.tsx',
  'src/components/LandingPage.tsx',
  'src/components/WorkspaceConsole.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Colors to white/grayscale equivalents
  content = content.replace(/text-indigo-400\/80/g, 'text-white/60');
  content = content.replace(/text-cyan-400\/85/g, 'text-white/80');
  content = content.replace(/text-cyan-400/g, 'text-white/90');
  content = content.replace(/hover:text-cyan-300/g, 'hover:text-white');
  content = content.replace(/text-cyan-300/g, 'text-white/80');
  content = content.replace(/text-emerald-400/g, 'text-white/80');
  content = content.replace(/text-rose-400/g, 'text-white/60');
  content = content.replace(/hover:text-rose-400/g, 'hover:text-white');
  content = content.replace(/text-purple-400/g, 'text-white/60');
  content = content.replace(/text-cyan-900/g, 'text-white/10');
  content = content.replace(/text-rose-200\/90/g, 'text-white/70');
  content = content.replace(/text-rose-200/g, 'text-white/80');
  content = content.replace(/text-rose-300/g, 'text-white/70');
  content = content.replace(/border-cyan-500\/50/g, 'border-white/20');
  
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done replacement text/border colors.');
