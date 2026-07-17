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
            let originalContent = content;
            
            // Remove burst scripts
            content = content.replace(/<Script[^>]*id="burst-timeme-js"[^>]*><\/Script>\n?/gi, '');
            content = content.replace(/<Script[^>]*id="burst-js"[^>]*><\/Script>\n?/gi, '');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed burst scripts in', fullPath);
            }
        }
    }
}
processDir(path.join(__dirname, 'src/app'));
