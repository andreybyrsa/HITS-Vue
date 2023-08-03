import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DevView from '@Views/DevView.vue'
import RegisterView from '@Views/RegisterView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/register/:id',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
