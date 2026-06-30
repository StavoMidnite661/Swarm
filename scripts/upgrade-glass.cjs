const fs = require('fs');

const files = [
  'src/components/CommandCenter.tsx',
  'src/components/CentralPanel.tsx',
  'src/components/RightPanel.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Upgrade the main panel borders
  content = content.replace(/border-white\/\[0\.04\] border-t-white\/\[0\.08\]/g, 'border-white/[0.08] border-t-white/[0.25] border-l-white/[0.15]');
  
  // Upgrade the inner elements borders
  content = content.replace(/border border-white\/\[0\.04\]/g, 'border border-white/[0.08]');
  
  // Shadows to have inner glow
  content = content.replace(/shadow-\[0_8px_32px_rgba\(0,0,0,0\.4\)\]/g, 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)]');
  content = content.replace(/shadow-\[0_4px_16px_rgba\(0,0,0,0\.2\)\]/g, 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)]');
  
  // Also fix shadow in Command Center active room state
  content = content.replace(/shadow-\[inset_0_0_20px_rgba\(255,255,255,0\.05\),0_4px_16px_rgba\(0,0,0,0\.3\)\]/g, 'shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.4)]');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done upgrading glass properties.');
