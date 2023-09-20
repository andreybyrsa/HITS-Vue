import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import useUserStore from '@Store/user/userStore'

import LocalStorageUser from '@Utils/LocalStorageUser'
import tooltipDirective from '@Utils/tooltip'
import dropdownDirective from '@Utils/dropdown'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import collapseDirective from '@Utils/collapse'

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

  if (
    !userStore.user &&
    !['login', 'register', 'forgot-password', 'new-password'].includes(currentRoute)
  ) {
    return { name: 'login' }
  }
})
app.use(router)

app.directive('tooltip', tooltipDirective)
app.directive('dropdown', dropdownDirective)
app.directive('collapse', collapseDirective)

app.mount('#app')
