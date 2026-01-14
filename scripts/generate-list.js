const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

function getHtmlFiles(dir, baseDir = dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath, baseDir));
    } else if (item.endsWith('.html') && item !== 'list.html') {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }
  return files;
}

function getAssetsFromHtml(distDir) {
  const htmlFiles = getHtmlFiles(distDir);
  if (htmlFiles.length === 0) return { css: [], js: [] };

  // 最初のHTMLファイルからCSS/JSのパスを取得
  const firstHtmlPath = path.join(distDir, htmlFiles[0]);
  const htmlContent = fs.readFileSync(firstHtmlPath, 'utf-8');

  const cssMatches = htmlContent.match(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi) || [];
  const jsMatches = htmlContent.match(/<script[^>]+src=["']([^"']+\.js)["'][^>]*>/gi) || [];

  const css = cssMatches
    .map(tag => {
      const match = tag.match(/href=["']([^"']+)["']/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  const js = jsMatches
    .map(tag => {
      const match = tag.match(/src=["']([^"']+)["']/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  return { css, js };
}

function generateListHtml(files, assets) {
  const listItems = files.map(file => `      <li><a href="${file}">${file}</a></li>`).join('\n');

  const cssLinks = assets.css.map(href => `  <link rel="stylesheet" href="${href}">`).join('\n');

  const jsScripts = assets.js
    .map(src => `  <script type="module" crossorigin src="${src}"></script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page List</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
    ul { list-style: none; padding: 0; }
    li { margin: 10px 0; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .design-link { margin-bottom: 30px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    .design-link a { color: #00a86b; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Page List</h1>
  <div class="design-link">
    <a href="https://www.figma.com/design/JYOHyAc6YV27KunmSIcDLG/%E3%81%99%E3%81%BF%E3%83%9A%E3%83%87%E3%82%A3%E3%82%A2_%E7%B4%8D%E5%93%81%E7%89%88?node-id=1-2&t=geU7soqbx3yIfvat-1" target="_blank" rel="noopener noreferrer">Figma - すみペディア_納品版</a>
  </div>
  <ul>
    ${listItems}
  </ul>
${jsScripts}
</body>
</html>`;
}

// dist/が存在するか確認
if (!fs.existsSync(distDir)) {
  console.log('dist/ directory not found. Creating...');
  fs.mkdirSync(distDir, { recursive: true });
}

const htmlFiles = getHtmlFiles(distDir);
const assets = getAssetsFromHtml(distDir);
const listHtml = generateListHtml(htmlFiles, assets);

fs.writeFileSync(path.join(distDir, 'list.html'), listHtml);
console.log(`Generated list.html with ${htmlFiles.length} files.`);
console.log(`CSS files: ${assets.css.length}, JS files: ${assets.js.length}`);
