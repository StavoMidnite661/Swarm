const fs = require('fs');

const file = 'src/components/WorkspaceConsole.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/>\/\/ CALENDAR METRIC LAYER</g, '>CALENDAR METRIC LAYER<');
content = content.replace(/>\/\/ SCHEDULE SOVEREIGN DEPLOYMENT TIMEBLOCK</g, '>SCHEDULE SOVEREIGN DEPLOYMENT TIMEBLOCK<');
content = content.replace(/>\/\/ DESTRUCTIVE OPERATION CONFIRMATION</g, '>DESTRUCTIVE OPERATION CONFIRMATION<');
content = content.replace(/>\/\/ EMAIL PRIORITY POOL</g, '>EMAIL PRIORITY POOL<');
content = content.replace(/>\/\/ COMPOSE EXECUTIVE TELEGRAM DISPATCH</g, '>COMPOSE EXECUTIVE TELEGRAM DISPATCH<');
content = content.replace(/>\/\/ SECURE DRAFT TELEGRAM REPLY</g, '>SECURE DRAFT TELEGRAM REPLY<');

fs.writeFileSync(file, content, 'utf8');

console.log('Done prefix removal.');
