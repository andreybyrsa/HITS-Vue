import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DevView from '@Views/DevView.vue'
import ForgotPass from '@Views/ForgotPassword.vue'
import NewPass from '@Views/NewPassword.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/forgot_pass',
    component: ForgotPass,
  },
  {
    path: '/new_pass/:id',
    component: NewPass,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
