import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import VueTheMask from 'vue-the-mask'
import { init, browserTracingIntegration, replayIntegration } from '@sentry/vue'
import {
  captureConsoleIntegration,
  httpClientIntegration,
} from '@sentry/integrations'
import { router } from '@Router'
import { tooltipDirective, dropdownDirective, collapseDirective } from '@Utils'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'

const app = createApp(App)

init({
  environment: 'production',
  dsn: 'https://deea9df213062f03aade238ad402371e@o4506773408710656.ingest.sentry.io/4506773410873344',
  app,
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
  integrations: [
    captureConsoleIntegration({
      levels: ['error'],
    }),
    httpClientIntegration({
      failedRequestStatusCodes: [400, [402, 599]],
    }),
    browserTracingIntegration({ router }),
    replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
})

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
