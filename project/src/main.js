import {createApp}from 'vue'
import App from './App.vue'
import { installVueDomPicker } from '@dom-picker/vue'
import "./index.css"
if (import.meta.env.DEV) {
  installVueDomPicker()
}

createApp(App).mount('#root-vue')