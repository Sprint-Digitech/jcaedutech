const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'layout.js') {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/<body([^>]*)>/i, (match, p1) => {
                if (!p1.includes('suppressHydrationWarning')) {
                    return `<body suppressHydrationWarning={true}${p1}>`;
                }
                return match;
            });
            content = content.replace(/data-burst_id="[^"]*"/g, '');
            content = content.replace(/data-burst_type="[^"]*"/g, '');
            fs.writeFileSync(fullPath, content);
            console.log('Fixed', fullPath);
        }
    }
}
processDir(path.join(__dirname, 'src/app'));
