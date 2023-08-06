import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import LocalStorageUser from '@Utils/LocalStorage'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
app.use(pinia)

const userStore = useUserStore()

router.beforeEach((to) => {
  userStore.checkLastActivity()
  const localStorageUser: User = LocalStorageUser.getLocalStorageUser()

  if (localStorageUser?.token && !userStore.user) {
    userStore.setUserFromLocalStorage(localStorageUser)
  }

  const currentRoute = to.name?.toString() ?? ''

  if (
    !userStore.user &&
    !['login', 'register', 'forgot-password'].includes(currentRoute)
  ) {
    return { name: 'login' }
  }
})
app.use(router)

app.mount('#app')
