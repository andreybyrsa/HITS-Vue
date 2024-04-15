import { createApp, markRaw } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'
import VueApexCharts from 'vue3-apexcharts'
import VueTheMask from 'vue-the-mask'

import tooltipDirective from '@Utils/tooltip'
import dropdownDirective from '@Utils/dropdown'
import collapseDirective from '@Utils/collapse'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const MODE: 'DEVELOPMENT' | 'PRODUCTION' = 'DEVELOPMENT'
const API_URL:
  | 'http://localhost:80/api/v1/ideas-service'
  | 'https://hits.tyuiu.ru/api/v1/ideas-service' =
  'http://localhost:80/api/v1/ideas-service'

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
app.use(pinia)

app.use(VueTheMask as any)

app.use(router)

app.use(VueApexCharts)

app.directive('tooltip', tooltipDirective)
app.directive('dropdown', dropdownDirective)
app.directive('collapse', collapseDirective)

app.mount('#app')

export { MODE, API_URL }
