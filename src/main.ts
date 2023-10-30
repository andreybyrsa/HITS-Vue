import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import LocalStorageUser from '@Utils/LocalStorageUser'
import tooltipDirective from '@Utils/tooltip'
import dropdownDirective from '@Utils/dropdown'
import collapseDirective from '@Utils/collapse'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const MODE = 'PRODUCTION'
const API_URL: 'http://localhost:3000/api/v1' | 'http://hits.tyuiu.ru/api/v1' =
  'http://localhost:3000/api/v1'

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
app.use(pinia)

const userStore = useUserStore()

router.beforeEach((to) => {
  userStore.checkLastActivity()
  const localStorageUser = LocalStorageUser.getLocalStorageUser()

  if (localStorageUser?.token && !userStore.user) {
    userStore.setUserFromLocalStorage(localStorageUser)
  }

  const currentRouteName = to.name?.toString() ?? ''
  const currentRoutePath = to.path?.toString() ?? ''
  const metaRoles = to.meta.roles as RolesTypes[]

  const path: string[] = []
  router.getRoutes().forEach((e) => path.push(e.path))

  // if (
  //   (metaRoles &&
  //     userStore.user?.role &&
  //     !metaRoles.includes(userStore.user?.role)) ||
  //   (userStore.user &&
  //     ['login', 'register', 'forgot-password', 'new-password'].includes(
  //       currentRouteName,
  //     )) ||
  //   (to.meta.isPageEdit
  //     ? currentRoutePath != '/edit-idea/' + to.params.id
  //     : to.meta.isPageEmail
  //     ? currentRoutePath != '/change-email/' + to.params.slug
  //     : to.meta.isPageRegister
  //     ? currentRoutePath != '/register/' + to.params.slug
  //     : !path.includes(currentRoutePath))
  // ) {
  //   router.push('error')
  // }

  if (
    !userStore.user &&
    !['login', 'register', 'forgot-password', 'new-password'].includes(
      currentRouteName,
    )
  ) {
    return { name: 'login' }
  }
})

app.use(router)

app.directive('tooltip', tooltipDirective)
app.directive('dropdown', dropdownDirective)
app.directive('collapse', collapseDirective)

app.mount('#app')

export { MODE, API_URL }
