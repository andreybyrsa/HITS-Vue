import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import NewEmail from '@Components/Modals/NewEmailModal/NewEmailModal.vue'

import LoginView from '@Views/LoginView.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'
import ChangeEmailView from '@Views/ChangeEmailView.vue'
import LastActivityNote from '@Views/LastActivityNote/LastActivityNote.vue'

import UsersView from '@Views/Admin/UsersView.vue'
import AddUsersView from '@Views/Admin/AddUsersView.vue'
import UsersGroupsView from '@Views/Admin/UsersGroupsView.vue'
import SkillsView from '@Views/Admin/SkillsView.vue'

import IdeasView from '@Views/Ideas/IdeasView.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'
import NewIdeaView from '@Views/Ideas/NewIdeaView.vue'
import EditIdeaView from '@Views/Ideas/EditIdeaView.vue'

import TeamsView from '@Views/Teams/TeamsView.vue'
import NewTeamView from '@Views/Teams/NewTeamView.vue'
import EditTeamView from '@Views/Teams/EditTeamView.vue'

import ErrorView from '@Views/ErrorView.vue'
import ProfileView from '@Views/Profile/ProfileView.vue'
import CommandView from '@Views/CommandView/CommandView.vue'

import DevView from '@Views/DevView.vue'

import RoleAndNotificationMiddleware from '@Middlewares/RoleAndNotificationMiddleware.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RoleAndNotificationMiddleware,
    children: [
      {
        path: 'ideas',
        children: [
          {
            path: 'list',
            name: 'ideas-list',
            meta: { roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'] },
            component: IdeasView,
            children: [
              {
                path: ':id',
                meta: { roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'] },
                component: IdeaModal,
              },
            ],
          },
          {
            path: 'create',
            meta: { roles: ['INITIATOR', 'ADMIN'] },
            component: NewIdeaView,
          },

          {
            path: 'update/:id',
            meta: { roles: ['INITIATOR', 'ADMIN'], isPageEdit: true },
            component: EditIdeaView,
          },
        ],
      },
      {
        path: 'teams',
        children: [
          {
            path: 'create',
            meta: { roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'] },
            component: NewTeamView,
          },
          {
            path: 'list',
            name: 'teams-list',
            meta: {
              roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
            },
            component: TeamsView,
          },
          {
            path: 'update/:id',
            meta: {
              roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
              isPageEdit: true,
            },
            component: EditTeamView,
          },
        ],
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
        children: [
          {
            path: 'users',
            component: UsersView,
            meta: { roles: ['ADMIN'] },
          },
          {
            path: 'add-users',
            component: AddUsersView,
            meta: { roles: ['ADMIN'] },
          },
          {
            path: 'users-groups',
            component: UsersGroupsView,
            meta: { roles: ['ADMIN'] },
          },
          {
            path: 'skills',
            component: SkillsView,
            meta: { roles: ['ADMIN'] },
          },
        ],
      },
      {
        path: 'change-email',
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
