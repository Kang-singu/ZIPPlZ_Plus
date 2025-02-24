// vite.config.js
import react from 'file:///c:/Users/SSAFY/Desktop/S11P12A602/ZIPPLZ_FE/node_modules/@vitejs/plugin-react-swc/index.mjs';
import svgr from 'file:///c:/Users/SSAFY/Desktop/S11P12A602/ZIPPLZ_FE/node_modules/vite-plugin-svgr/dist/index.js';
import tsconfigPaths from 'file:///c:/Users/SSAFY/Desktop/S11P12A602/ZIPPLZ_FE/node_modules/vite-tsconfig-paths/dist/index.mjs';
import { defineConfig } from 'file:///c:/Users/SSAFY/Desktop/S11P12A602/ZIPPLZ_FE/node_modules/vite/dist/node/index.js';

var vite_config_default = defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://zipplz.site/api/',
        changeOrigin: true,
        rewrite: function (path) {
          return path.replace(/^\/api/, '');
        },
      },
      '/ws': {
        target: 'https://zipplz.site/api/',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
export { vite_config_default as default };
