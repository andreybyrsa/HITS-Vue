import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AdminAddUser from '@Views/AdminAddUser.vue'
import DevView from '@Views/DevView.vue'
import LoginView from '@Views/LoginView.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'
import NewPasswordView from '@Views/NewPasswordView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/register/:token',
    component: RegisterView,
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordView,
  },
  {
    path: '/new-password/:token',
    component: NewPasswordView,
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
