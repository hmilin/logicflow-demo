import 'normalize.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import Icon from './components/Icon'
import router from './router'
import './styles/styles.less'

const app = createApp(App)

app.component('Icon', Icon)

if (process.env.NODE_ENV === 'development') {
  app.config.devtools = true
}

const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
