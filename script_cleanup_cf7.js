const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('Component.js') || file === 'layout.js') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Remove speculation rules
            content = content.replace(/<script\s+type="speculationrules"[\s\S]*?\/>\n?/g, '');
            
            // Remove contact form 7 scripts and styles
            content = content.replace(/<script\s+type="text\/javascript"\s+src="\/wp-content\/plugins\/contact-form-7[^>]*><\/script>\n?/g, '');
            content = content.replace(/<script\s+type="text\/javascript"\s+id="contact-form-7-js-before"[\s\S]*?\/>\n?/g, '');
            content = content.replace(/<link[^>]*contact-form-7[^>]*\/>\n?/g, '');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Cleaned up CF7 & Speculation Rules in', fullPath);
            }
        }
    }
}
processDir(path.join(__dirname, 'src/app'));
