import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

//handlebarsプラグインimport
import handlebars from 'vite-plugin-handlebars';

//HTML上で出し分けたい各ページごとの情報
const pageData = {
  'index.html': {
    isHome: true,
    title: 'Main Page'
  }
};

const root = 'src';

// srcディレクトリ内のHTMLファイルを取得してinputオブジェクトを生成
const getHtmlInputs = () => {
  const srcPath = resolve(__dirname, root);
  const files = fs.readdirSync(srcPath);
  const htmlInputs = {};

  files.forEach(file => {
    if (file.endsWith('.html')) {
      const key = file.replace('.html', '');
      htmlInputs[key] = resolve(srcPath, file);
    }
  });

  return htmlInputs;
};

export default defineConfig({
  base: './',
  server: {
    host: true
  },
  root: root, //開発ディレクトリ設定
  build: {
    outDir: '../dist', //出力場所の指定
    rollupOptions: {
      //ファイル出力設定
      output: {
        assetFileNames: assetInfo => {
          let extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          }
          //ビルド時のCSS名を明記してコントロールする
          if (extType === 'css') {
            return `assets/css/style.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        // 単一のバンドルを生成
        manualChunks: undefined
      },
      input: getHtmlInputs()
    }
  },
  /*
    プラグインの設定を追加
  */
  plugins: [
    handlebars({
      //コンポーネントの格納ディレクトリを指定
      partialDirectory: resolve(__dirname, root, 'components'),
      //各ページ情報の読み込み
      context(pagePath) {
        const pageName = pagePath.split('/').pop();
        return pageData[pageName];
      }
    })
  ]
});
