// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'build.js'),
      name: 'LitMovable',
      fileName: 'index',
    },
    rollupOptions: {
      // Consumers bring their own lit (peerDependency).
      external: [/^lit(\/|$)/],
      output: {
        globals: {
          lit: 'Lit',
        },
      },
    },
  },
})
