import { defineConfig } from 'umi';
import path from 'path';

const isDeploy = process.env.DEPLOY === '1';

export default defineConfig({
  mode: 'doc',
  title: 'MovableType',
  description: '纯渲染型配置引擎 - JSON 即表单',
  locales: [['zh-CN', '中文']],
  outputPath: 'docs',
  publicPath: isDeploy ? '/MovableType/' : '/',
  base: isDeploy ? '/MovableType' : '/',
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    antd: 'window.antd',
  },
  scripts: [
    'https://unpkg.com/react@17/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    'https://unpkg.com/antd@4/dist/antd.min.js',
  ],
  routes: [
    { path: '/', component: './src/README.md', exact: true },
  ],
  alias: {
    '@': path.join(__dirname, 'src'),
  },
  resolve: {
    includes: ['src'],
  },
});
