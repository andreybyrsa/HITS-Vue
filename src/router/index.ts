import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AddUsersForm from '@Components/Forms/AddUsersForm/AddUsersForm.vue'
import EditUsersForm from '@Components/Forms/EditUsersForm/EditUsersForm.vue'
import ExpertGroupForm from '@Components/Forms/ExpertGroupForm/ExpertGroupForm.vue'

import AdminView from '@Views/AdminView.vue'
import DevView from '@Views/DevView.vue'
import LoginView from '@Views/LoginView.vue'
import NewIdeaView from '@Views/NewIdeaView.vue'
import EditIdeaView from '@Views/EditIdeaView.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'

import IdeasView from '@Views/IdeasView.vue'

import RoleMiddleware from '../middlewares/RoleMiddleware.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: RoleMiddleware,
    children: [
      {
        path: '/ideas',
        name: 'ideas',
        component: IdeasView,
      },
      {
        path: 'add-idea',
        name: 'addIdeas',
        component: NewIdeaView,
      },
      {
        path: 'edit-idea/:id',
        name: 'editIdeas',
        component: EditIdeaView,
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
          {
            path: 'users-group',
            component: ExpertGroupForm,
          },
        ],
      },
      {
        path: 'dev',
        name: 'dev',
        component: DevView,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register/:slug',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
