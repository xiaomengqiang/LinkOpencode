import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import createDomPickerVueNodeTransform from '@dom-picker/vue/node-transform'

// https://vite.dev/config/ 
export default defineConfig(({ command }) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          nodeTransforms: command === 'serve' ? [createDomPickerVueNodeTransform()] : [],
        },
      },
    }),
  ],
  server: {
    port: 7686,   // 你也可以在这里指定固定的端口
  },
}))