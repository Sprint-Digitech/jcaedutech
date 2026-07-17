const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'layout.js' || file.endsWith('Component.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Remove local elementor fonts
            content = content.replace(/<link[^>]*elementor-gf-local[^>]*\/>\n?/gi, '');
            content = content.replace(/<link[^>]*elementor\/google-fonts[^>]*\/>\n?/gi, '');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed fonts in', fullPath);
            }
        }
    }
}
processDir(path.join(__dirname, 'src/app'));
