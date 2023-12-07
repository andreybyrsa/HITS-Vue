import { createApp, markRaw } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'
import VueApexCharts from 'vue3-apexcharts'

import tooltipDirective from '@Utils/tooltip'
import dropdownDirective from '@Utils/dropdown'
import collapseDirective from '@Utils/collapse'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const MODE: 'DEVELOPMENT' | 'PRODUCTION' = 'PRODUCTION'
const API_URL: 'http://localhost:80/api/v1' | 'https://hits.tyuiu.ru/api/v1' =
  'http://localhost:80/api/v1'

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
app.use(pinia)

app.use(router)

app.use(VueApexCharts)

app.directive('tooltip', tooltipDirective)
app.directive('dropdown', dropdownDirective)
app.directive('collapse', collapseDirective)

app.mount('#app')

export { MODE, API_URL }
