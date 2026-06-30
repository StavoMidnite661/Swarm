const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

// The risk card container is setting text-[10px], let's change it to text-sm
content = content.replace(/gap-1\.5 text-\[10px\] font-sans/g, 'gap-1.5 text-xs font-sans');
content = content.replace(/<span className="text-white font-bold leading-snug">/g, '<span className="text-white font-bold text-sm leading-snug">');

// For the approvals list in Legal & Risk Gate room (left tab)
content = content.replace(/gap-2 relative">\n\s*<div className="flex justify-between items-start">/g, 'gap-2 relative">\n                      <div className="flex justify-between items-start">');
// Actually, let's just use string replace for the title in the risk tab
content = content.replace(/<span className="text-xs font-sans font-light tracking-wide font-bold text-white mt-1\.5 block">/g, '<span className="text-sm font-sans font-light tracking-wide font-bold text-white mt-1.5 block">');

fs.writeFileSync(path, content);
console.log('Risk text sizes fixed.');
