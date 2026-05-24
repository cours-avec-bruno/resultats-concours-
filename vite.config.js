import { defineConfig } from 'vite';

export default defineConfig({
  base: '/resultats-concours-/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
