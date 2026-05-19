import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  mode: 'doc',
  title: 'MovableType',
  description: '纯渲染型配置引擎 - JSON 即表单',
  locales: [['zh-CN', '中文']],
  outputPath: 'docs',
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  // dumi 1 的 demo 扫描配置
  resolve: {
    includes: ['src'],
  },
});
