const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

// Center column max height fix
content = content.replace(/className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-\[220px\]"/g, 'className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-full"');

// Fix text sizes on risk tab
content = content.replace(/text-\[8\.5px\]/g, 'text-[10px]');
content = content.replace(/text-\[6\.5px\]/g, 'text-[10px]');
content = content.replace(/text-\[7\.5px\]/g, 'text-xs');
content = content.replace(/text-\[7px\]/g, 'text-[10px]');

fs.writeFileSync(path, content);
console.log('Styles cleaned up.');
