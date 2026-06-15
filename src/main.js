import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './assets/style.css'

axios.defaults.baseURL = 'http://localhost:8000/api/'

const app = createApp(App)

app.use(router)

app.mount('#app')
