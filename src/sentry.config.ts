// import { createApp } from 'vue'
// import { createRouter, createWebHistory } from 'vue-router'
// import * as Sentry from '@sentry/vue'
// import {
//   captureConsoleIntegration,
//   httpClientIntegration,
// } from '@sentry/integrations'
// const app = createApp({
//   // ...
// })
// const router = createRouter({
//   history: createWebHistory(),
//   routes: [],
// })
// Sentry.init({
//   dsn: 'https://b5deaff408ff536972eaf46393abe091@o4506773408710656.ingest.sentry.io/4506813439868928',
//   app,
//   tracesSampleRate: 1.0,
//   tracePropagationTargets: ['localhost'],
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
//   sendDefaultPii: true,
//   integrations: [
//     captureConsoleIntegration({
//       levels: ['error'],
//     }),
//     httpClientIntegration({
//       failedRequestStatusCodes: [400, [402, 599]],
//     }),
//     Sentry.browserTracingIntegration({ router }),
//     Sentry.replayIntegration({
//       maskAllText: false,
//       blockAllMedia: false,
//     }),
//   ],
// })
// try {
//   throw new Error('error')
// } catch (error) {
//   Sentry.captureException(error)
//   console.error('Ошибка отправлена на sentry', error)
// }
// app.use(router)
// app.mount('#app')
