import { createApp } from 'vue'
import { Icon } from '@iconify/vue'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.component('Icon', Icon)

app.use(router)

app.mount('#app')
