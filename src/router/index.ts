import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DevView from '@Views/DevView.vue'
import AdminAddUser from '@Views/AdminAddUser.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/admin/',
    children: [
      {
        path: 'add/user',
        name: 'addUser',
        component: AdminAddUser,
      },
      {
        path: 'add/users',
        name: 'addUsers',
        component: AdminAddUser,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
