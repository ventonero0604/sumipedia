const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

function fixHtmlFiles(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixHtmlFiles(fullPath);
    } else if (item.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf-8');

      // head内のscript tagを抽出
      const scriptMatch = content.match(
        /<script type="module" crossorigin src="([^"]+)"><\/script>/
      );

      if (scriptMatch) {
        const scriptSrc = scriptMatch[1];

        // head内のscript tagを削除
        content = content.replace(
          /<script type="module" crossorigin src="[^"]+"><\/script>\s*/g,
          ''
        );

        // </body>直前にtype="module"なしのscriptを挿入
        content = content.replace(/<\/body>/, `  <script src="${scriptSrc}"></script>\n</body>`);

        fs.writeFileSync(fullPath, content);
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

fixHtmlFiles(distDir);
console.log('Done!');
