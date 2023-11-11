import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

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

import DevView from '@Views/DevView.vue'

import useUserStore from '@Store/user/userStore'

import LocalStorageUser from '@Utils/LocalStorageUser'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'ideas-list' },
  },
  {
    path: '/ideas',
    redirect: { name: 'ideas-list' },
    children: [
      {
        path: 'list',
        name: 'ideas-list',
        component: IdeasView,
        children: [
          {
            path: ':id',
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
        meta: { roles: ['INITIATOR', 'ADMIN'] },
        component: EditIdeaView,
      },
    ],
  },
  {
    path: '/teams',
    redirect: { name: 'teams-list' },
    children: [
      {
        path: 'list',
        name: 'teams-list',
        component: TeamsView,
      },
      {
        path: 'create',
        component: NewTeamView,
      },
      {
        path: 'update/:id',
        component: EditTeamView,
      },
    ],
  },
  {
    path: '/admin',
    redirect: { path: '/admin/users' },
    meta: { roles: ['ADMIN'] },
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
    path: '/change-email',
    name: 'change-email',
    component: ChangeEmailView,
    children: [
      {
        path: ':slug',
        name: 'change-email-confirmation',
        component: NewEmail,
      },
    ],
  },
  {
    path: '/last-activity-note',
    component: LastActivityNote,
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
  {
    path: '/dev',
    component: DevView,
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'error' },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  const { user } = storeToRefs(userStore)
  const localStorageUser = LocalStorageUser.getLocalStorageUser()

  const currentRouteName = to.name?.toString() ?? ''
  const requiredRouteRoles = to.meta?.roles ?? []
  const authRouteNames = ['login', 'register', 'forgot-password']

  if (localStorageUser?.token && !user.value?.token) {
    useUserStore().setUser(localStorageUser)
  }

  if (!user.value && !authRouteNames.includes(currentRouteName)) {
    return { name: 'login' }
  }
  if (user.value && authRouteNames.includes(currentRouteName)) {
    return { name: 'ideas-list' }
  }
  if (requiredRouteRoles.length && user.value?.role) {
    const { role } = user.value

    return requiredRouteRoles.includes(role) ? true : { name: 'error' }
  }
})

export default router
