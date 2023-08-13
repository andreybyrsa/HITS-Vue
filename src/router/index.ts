import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AddUsersForm from '@Components/Forms/AddUsersForm/AddUsersForm.vue'
import EditUsersForm from '@Components/Forms/EditUsersForm/EditUsersForm.vue'

import AdminView from '@Views/AdminView.vue'
import DevView from '@Views/DevView.vue'
import LoginView from '@Views/LoginView.vue'
import NewIdeas from '@Views/NewIdeas.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'
import NewPasswordView from '@Views/NewPasswordView.vue'

import IdeasView from '@Views/IdeasView.vue'

import RoleMiddleware from '../middlewares/RoleMiddleware.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: RoleMiddleware,
    children: [
      {
        path: 'dev',
        name: 'dev',
        component: DevView,
      },
      {
        path: 'add-idea',
        name: 'addIdeas',
        component: NewIdeas,
      },
      {
        path: 'admin',
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
    ],
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
    path: '/ideas',
    name: 'ideas',
    component: IdeasView,
  },
  {
    path: '/new-password/:slug',
    name: 'new-password',
    component: NewPasswordView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
