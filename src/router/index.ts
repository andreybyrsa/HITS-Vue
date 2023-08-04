import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DevView from '@Views/DevView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/admin',
    component: DevView,
    children: [
      {
        path: '/admin/add-users',
        component: DevView,
      },
      {
        path: '/admin/edit-users',
        component: DevView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
