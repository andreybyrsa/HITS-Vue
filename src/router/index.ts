import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import DevView from '@Views/DevView.vue'
import LoginView from '@Views/LoginView.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'
import NewPasswordView from '@Views/NewPasswordView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    name: 'dev',
    component: DevView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register/:token',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
  },
  {
    path: '/new-password/:token',
    name: 'new-password',
    component: NewPasswordView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
