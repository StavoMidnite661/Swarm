const fs = require('fs');
const path = './src/components/CommandCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexes = [
  [/border-[a-z]+-500\/20/g, 'border-white/10'],
  [/text-[a-z]+-400/g, 'text-white/80'],
  [/text-[a-z]+-500/g, 'text-white/60'],
  [/shadow-\[0_0_15px_rgba\([0-9,]+\.1\)\]/g, 'shadow-md shadow-black/20'],
  [/backdrop-blur-3xl backdrop-blur-md/g, 'backdrop-blur-3xl'],
  [/font-sans font-light tracking-wide tracking-tight/g, 'font-sans tracking-tight'],
  [/font-sans font-light tracking-wide text-xs/g, 'font-sans font-light text-xs tracking-wide'],
];

for (const [r, sub] of regexes) {
  content = content.replace(r, sub);
}

fs.writeFileSync(path, content);
console.log('Styles updated.');
