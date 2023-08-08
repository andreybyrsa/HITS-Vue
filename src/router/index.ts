import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AddUsersForm from '@Components/Forms/AddUsersForm/AddUsersForm.vue'
import EditUsersForm from '@Components/Forms/EditUsersForm/EditUsersForm.vue'

import AdminView from '@Views/AdminView.vue'
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
    path: '/new-password/:slug',
    name: 'new-password',
    component: NewPasswordView,
  },
  {
    path: '/admin',
    component: AdminView,
    children: [
      {
        path: 'add-users',
        component: AddUsersForm,
      },
      {
        path: 'edit-users',
        component: EditUsersForm,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
