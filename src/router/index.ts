import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AddUsersForm from '@Components/Forms/AddUsersForm/AddUsersForm.vue'
import EditUsersForm from '@Components/Forms/EditUsersForm/EditUsersForm.vue'
import UsersGroupsForm from '@Components/Forms/UsersGroupsForm/UsersGroupsForm.vue'
import NewEmail from '@Components/Modals/NewEmailModal/NewEmailModal.vue'
import SkillsForm from '@Components/Forms/CompetenciesMenuForm/Skills.vue'

import AdminView from '@Views/AdminView.vue'
import DevView from '@Views/DevView.vue'
import LoginView from '@Views/LoginView.vue'
import NewIdeaView from '@Views/NewIdeaView.vue'
import EditIdeaView from '@Views/EditIdeaView.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'
import ChangeEmailView from '@Views/ChangeEmailView.vue'
import IdeasView from '@Views/IdeasView/IdeasView.vue'
import LastActivityNote from '@Views/LastActivityNote/LastActivityNote.vue'
import ErrorView from '@Views/ErrorView.vue'
import ProfileView from '@Views/Profile/ProfileView.vue'

import RoleMiddleware from '@Middlewares/RoleMiddleware.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RoleMiddleware,
    children: [
      {
        path: 'ideas',
        name: 'ideas',
        meta: {
          roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        },
        component: IdeasView,
      },
      {
        path: 'add-idea',
        name: 'addIdeas',
        meta: { roles: ['INITIATOR', 'ADMIN'] },
        component: NewIdeaView,
      },
      {
        path: 'edit-idea/:id',
        name: 'editIdeas',
        meta: { roles: ['INITIATOR', 'ADMIN'], isPageEdit: true },
        component: EditIdeaView,
      },
      {
        path: 'last-activity-note',
        name: 'last-activity-note',
        meta: {
          roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        },
        component: LastActivityNote,
      },
      {
        path: 'profile/:id',
        name: 'profile',
        meta: {
          roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        },
        component: ProfileView,
      },
      {
        path: 'admin',
        component: AdminView,
        children: [
          {
            path: 'add-users',
            component: AddUsersForm,
            meta: { roles: ['ADMIN'] },
          },
          {
            path: 'edit-users',
            component: EditUsersForm,
            meta: { roles: ['ADMIN'] },
          },
          {
            path: 'users-groups',
            component: UsersGroupsForm,
            meta: { roles: ['ADMIN'] },
          },
          {
            path: 'skills',
            component: SkillsForm,
            meta: { roles: ['ADMIN'] },
          },
        ],
      },
      {
        path: '/change-email',
        name: 'change-email',
        component: ChangeEmailView,
        meta: {
          roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        },
        children: [
          {
            path: ':slug',
            name: 'change-email-confirmation',
            meta: {
              roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
              isPageEmail: true,
            },
            component: NewEmail,
          },
        ],
      },
      {
        path: 'error',
        name: 'error',
        meta: {
          roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        },
        component: ErrorView,
      },
      {
        path: 'dev',
        name: 'dev',
        meta: { roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'] },
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
    meta: { isPageRegister: true },
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
