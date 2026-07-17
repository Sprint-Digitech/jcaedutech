const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/(home)/layout.js');
let content = fs.readFileSync(file, 'utf8');

// The body tag might look like: <body className="home wp-singular...
// Replace <body(.*?)> with <body suppressHydrationWarning={true}$1> but make sure not to double add it.
content = content.replace(/<body([^>]*)>/i, (match, p1) => {
    if (!p1.includes('suppressHydrationWarning')) {
        return `<body suppressHydrationWarning={true}${p1}>`;
    }
    return match;
});

// also remove burst_id, burst_type just to be safe
content = content.replace(/data-burst_id="[^"]*"/g, '');
content = content.replace(/data-burst_type="[^"]*"/g, '');

fs.writeFileSync(file, content);
console.log("Fixed body tag in home layout.js");
