import { defineStore } from 'pinia'
import InitialState from './initialState'

import { User, LoginUser, RegisterUser } from '@Domain/User'

import AuthService from '@Services/AuthService'
import LocalStorageUser from '@Utils/LocalStorage'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async loginUser(user: LoginUser) {
      try {
        const response = await AuthService.loginUser(user)

        if (response.token) {
          const localStorageUser =
            LocalStorageUser.setLocalStorageUser(response)

          this.user = localStorageUser

          this.router.push({ name: 'dev' })
        }
      } catch (error) {
        console.warn(error)
      }
    },
    async registerUser(user: RegisterUser) {
      try {
        const response = await AuthService.registerUser(user)

        if (response.token) {
          const localStorageUser =
            LocalStorageUser.setLocalStorageUser(response)

          this.user = localStorageUser

          this.router.push({ name: 'dev' })
        }
      } catch (error) {
        console.warn(error)
      }
    },
    setUserFromLocalStorage(localStorageUser: User) {
      this.user = localStorageUser
    },
    removeUser() {
      this.user = null
      localStorage.removeItem('user')
    },

    checkLastActivity() {
      const currentActivity = new Date()
      const currentUser = LocalStorageUser.getLocalStorageUser()
      if (
        currentUser?.lastActivity &&
        currentActivity.getMinutes() - currentUser.lastActivity?.getMinutes() >
          10
      ) {
        this.removeUser()
        localStorage.removeItem('user')
      } else if (currentUser?.token) {
        LocalStorageUser.setLocalStorageUser(currentUser)
      }
    },
  },
})

export default useUserStore
