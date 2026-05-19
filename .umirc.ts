import { defineConfig } from 'umi';
import path from 'path';

export default defineConfig({
  routes: [
    { path: '/', component: './src/README.md', exact: true },
  ],
  alias: {
    '@': path.join(__dirname, 'src'),
  },
});
