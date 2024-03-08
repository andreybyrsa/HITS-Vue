import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import VueTheMask from 'vue-the-mask'
import { router } from '@Router'
import { tooltipDirective, dropdownDirective, collapseDirective } from '@Utils'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'

const app = createApp(App)

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
