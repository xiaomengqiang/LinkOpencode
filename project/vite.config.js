import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import createDomPickerReactPlugin from '@dom-picker/react/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [createDomPickerReactPlugin(), react()],
  server: {
    port: 7686,
    host: true
  }
})