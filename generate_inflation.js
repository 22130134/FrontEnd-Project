const fs = require('fs');
let content = '';
for (let i = 1; i <= 3000; i++) {
    content += `/* Line ${i} */ .inf-${i} { display: none; }\n`;
}
fs.writeFileSync('src/components/css/inflation.css', content);
console.log('Done');
