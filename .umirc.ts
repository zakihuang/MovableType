import { defineConfig } from 'umi';
import path from 'path';

const isDeploy = process.env.DEPLOY === '1';

export default defineConfig({
  mode: 'doc',
  title: 'MovableType',
  logo: isDeploy ? '/MovableType/logo.svg' : '/logo.svg',
  links: [
    { rel: 'icon', type: 'image/svg+xml', href: isDeploy ? '/MovableType/logo.svg' : '/logo.svg' },
  ],
  description: '纯渲染型配置引擎, 为 AI 而生',
  locales: [['zh-CN', '中文']],
  outputPath: 'docs',
  publicPath: isDeploy ? '/MovableType/' : '/',
  base: isDeploy ? '/MovableType' : '/',
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    antd: 'window.antd',
    moment: 'window.moment',
  },
  scripts: [
    'https://unpkg.com/react@17/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    'https://unpkg.com/moment@2.29.4/min/moment.min.js',
    'https://unpkg.com/antd@4/dist/antd.min.js',
  ],
  alias: {
    '@': path.join(__dirname, 'src'),
  },
  resolve: {
    includes: ['.', 'src'],
  },
  copy: [
    { from: 'src/assets/logo.svg', to: 'logo.svg' },
    { from: 'src/assets/aiDrivenMovable.jpeg', to: 'aiDrivenMovable.jpeg' },
    { from: 'src/assets/woodblockToMovabletype.jpeg', to: 'woodblockToMovabletype.jpeg' },
  ],
});
