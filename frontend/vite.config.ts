import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://zipplz.site',
        changeOrigin: true,
        rewrite: function (path) {
          return path.replace(/^\/api/, '');
        },
      },
      '/ws': {
        target: 'https://zipplz.site',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
