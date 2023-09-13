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
import { string } from 'yup'

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
  const checkRole = to.meta.roles as string

  if (userStore.user?.role?.includes(checkRole)) {
    router.push('ideas')
  }
  // if (to.meta.isAdmin && userStore.user?.role != 'ADMIN') {
  //   // router.push('ideas')
  // }

  if (
    !userStore.user &&
    !['login', 'register', 'forgot-password', 'new-password'].includes(currentRoute)
  ) {
    return { name: 'login' }
  }
})
app.use(router)

app.mount('#app')
