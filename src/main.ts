import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import useUserStore from '@Store/user/userStore'

import LocalStorageUser from '@Utils/LocalStorageUser'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import RolesTypes from '@Domain/Roles'

const app = createApp(App)

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

  const currentRoute = to.name?.toString() ?? ''
  const currentRouteHatch = to.path?.toString() ?? ''
  const metaRoles = to.meta.roles as RolesTypes[]
  const path: string[] = []
  router.getRoutes().forEach((e) => path.push(e.path))

  if (
    (metaRoles &&
      userStore.user?.role &&
      !metaRoles.includes(userStore.user?.role)) ||
    (userStore.user &&
      ['login', 'register', 'forgot-password', 'new-password'].includes(
        currentRoute,
      )) 
    //   ||
    // (path && !path.includes(currentRouteHatch))
  ) {
    router.push('error')
  }

  if (
    !userStore.user &&
    !['login', 'register', 'forgot-password', 'new-password'].includes(currentRoute)
  ) {
    return { name: 'login' }
  }
})

app.use(router)

app.mount('#app')
