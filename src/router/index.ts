import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DevView from '@Views/DevView.vue'
import FgPass from '@Views/ForgotPassword.vue'
import NewPass from '@Views/NewPassword.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/fg_pass',
    component: FgPass,
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
