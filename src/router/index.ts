import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@Store'
import { getRouteByUserRole, localStorageUser } from '@Utils'
import IdeaMarketModal from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import LoginView from '@Views/LoginView.vue'
import RegisterView from '@Views/RegisterView.vue'
import ForgotPasswordView from '@Views/ForgotPasswordView.vue'
import ChangeEmailView from '@Views/ChangeEmailView.vue'
import UsersView from '@Views/Admin/UsersView.vue'
import AddUsersView from '@Views/Admin/AddUsersView.vue'
import UsersGroupsView from '@Views/Admin/UsersGroupsView.vue'
import SkillsView from '@Views/Admin/SkillsView.vue'
import CompaniesView from '@Views/Admin/CompaniesView.vue'
import IdeasView from '@Views/Ideas/IdeasView.vue'
import NewIdeaView from '@Views/Ideas/NewIdeaView.vue'
import EditIdeaView from '@Views/Ideas/EditIdeaView.vue'
import TeamsView from '@Views/Teams/TeamsView.vue'
import NewTeamView from '@Views/Teams/NewTeamView.vue'
import EditTeamView from '@Views/Teams/EditTeamView.vue'
import MarketsView from '@Views/Markets/MarketsView.vue'
import IdeasMarketView from '@Views/IdeasMarket/IdeasMarketView.vue'
import HomeView from '@Views/HomeView.vue'
import ErrorView from '@Views/ErrorView.vue'
import LastActivityNote from '@Views/LastActivityNote/LastActivityNote.vue'
import DevView from '@Views/DevView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/ideas',
    redirect: { name: 'ideas-list' },
    children: [
      {
        path: 'list',
        name: 'ideas-list',
        component: IdeasView,
        meta: {
          roles: ['INITIATOR', 'MEMBER', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        },
        children: [
          {
            path: ':id',
            name: 'idea-modal',
            component: IdeaModal,
            meta: {
              roles: ['INITIATOR', 'MEMBER', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
            },
          },
        ],
      },
      {
        name: 'create-idea',
        path: 'create',
        meta: { roles: ['INITIATOR', 'ADMIN'] },
        component: NewIdeaView,
      },
      {
        name: 'update-idea',
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
        meta: { roles: ['INITIATOR', 'TEAM_OWNER', 'MEMBER', 'ADMIN'] },
        children: [
          {
            path: ':teamId',
            name: 'team',
            component: TeamModal,
            meta: { roles: ['INITIATOR', 'TEAM_OWNER', 'MEMBER', 'ADMIN'] },
          },
          {
            name: 'profile',
            path: 'profile/:id',
            alias: '/profile/:id',
            component: ProfileModal,
          },
        ],
      },
      {
        name: 'create-team',
        path: 'create',
        component: NewTeamView,
        meta: { roles: ['TEAM_OWNER', 'ADMIN'] },
      },
      {
        name: 'update-team',
        path: 'update/:id',
        component: EditTeamView,
        meta: { roles: ['TEAM_OWNER', 'ADMIN'] },
      },
    ],
  },
  {
    path: '/market',
    name: 'market',
    meta: {
      roles: ['INITIATOR', 'MEMBER', 'TEAM_OWNER', 'PROJECT_OFFICE', 'ADMIN'],
    },
    children: [
      {
        path: 'list',
        name: 'markets-list',
        component: MarketsView,
        meta: { roles: ['PROJECT_OFFICE', 'ADMIN'] },
      },
      {
        path: ':marketId',
        name: 'market-ideas',
        component: IdeasMarketView,
        meta: {
          roles: ['INITIATOR', 'MEMBER', 'TEAM_OWNER', 'PROJECT_OFFICE', 'ADMIN'],
        },
        children: [
          {
            path: ':ideaMarketId',
            name: 'market-idea-modal',
            component: IdeaMarketModal,
            meta: {
              roles: [
                'INITIATOR',
                'MEMBER',
                'TEAM_OWNER',
                'PROJECT_OFFICE',
                'ADMIN',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    redirect: { path: '/admin/users' },
    meta: { roles: ['ADMIN'] },
    children: [
      {
        name: 'admin-users',
        path: 'users',
        component: UsersView,
        meta: { roles: ['ADMIN'] },
      },
      {
        name: 'admin-add-users',
        path: 'add-users',
        component: AddUsersView,
        meta: { roles: ['ADMIN'] },
      },
      {
        name: 'admin-users-groups',
        path: 'users-groups',
        component: UsersGroupsView,
        meta: { roles: ['ADMIN'] },
      },
      {
        name: 'admin-skills',
        path: 'skills',
        component: SkillsView,
        meta: { roles: ['ADMIN'] },
      },
      {
        name: 'admin-companies',
        path: 'companies',
        component: CompaniesView,
        meta: { roles: ['ADMIN'] },
      },
    ],
  },
  {
    path: '/change-email/:slug',
    name: 'change-email',
    component: ChangeEmailView,
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

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  const { user } = storeToRefs(userStore)
  const lsUser = localStorageUser.getLocalStorageUser()

  if (lsUser?.token && !user.value?.token) {
    useUserStore().setUser(lsUser)
  }

  const currentRouteName = to.name?.toString() ?? ''
  const requiredRouteRoles = to.meta?.roles ?? []
  const authRouteNames = ['login', 'register', 'forgot-password']

  if (!user.value && !authRouteNames.includes(currentRouteName)) {
    return { name: 'login' }
  }

  if (
    user.value?.role &&
    (authRouteNames.includes(currentRouteName) || currentRouteName === 'home')
  ) {
    const { role } = user.value

    return getRouteByUserRole(role)
  }

  if (requiredRouteRoles.length && user.value?.role) {
    const { role } = user.value

    return requiredRouteRoles.includes(role) ? true : { name: 'error' }
  }
})
