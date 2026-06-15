import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { useToast } from './composables/useToast.js'

axios.defaults.baseURL = 'http://localhost:8000/api/'

const { show } = useToast()

let toastPending = false            //toast de erro e remove a default do navegador
document.addEventListener('invalid', (e) => {
  e.preventDefault()
  if (!toastPending) {
    toastPending = true
    show('Preencha todos os campos obrigatórios.', 'error')      //mensagem de erro
    setTimeout(() => { toastPending = false }, 100)
  }
}, true)

const app = createApp(App)

app.use(router)

app.mount('#app')
