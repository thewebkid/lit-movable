// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    copyPublicDir:false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'build.js'),
      name: 'lit-movable',
      // the proper extensions will be added
      fileName: 'index',
    }

  }
})
