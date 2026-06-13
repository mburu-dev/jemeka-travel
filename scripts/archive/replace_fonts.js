const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdir(dir, function(err, list) {
    if (err) return callback(err);
    let pending = list.length;
    if (!pending) return callback(null);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err) {
            if (!--pending) callback(null);
          });
        } else {
          if (file.endsWith('.tsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let newContent = content.replace(/style=\{\{\s*fontFamily:\s*"'Playfair Display', serif"(.*?)\}\}/g, "style={{ fontFamily: 'var(--font-heading)'$1 }}");
            if (content !== newContent) {
              fs.writeFileSync(file, newContent);
              console.log('Updated ' + file);
            }
          }
          if (!--pending) callback(null);
        }
      });
    });
  });
}

walk(path.join(__dirname, 'apps/web/src'), () => console.log('Done apps'));
walk(path.join(__dirname, 'packages/ui/src'), () => console.log('Done packages'));
