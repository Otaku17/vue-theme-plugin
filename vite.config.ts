import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts', // Ton fichier d'export principal
      name: 'VueThemePlugin',
      fileName: (format) => `vue-theme-plugin.${format}.js`,
    },
    rollupOptions: {
      // Exclure vue en peerDependency
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
