import { defineStore } from 'pinia'
import InitialState from './initialState'

import { User, LoginUser, RegisterUser } from '@Domain/User'

import AuthService from '@Services/AuthService'
import LocalStorageUser from '@Utils/LocalStorageUser'
import RolesTypes from '@Domain/Roles'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
    loginError: '',
    registerError: '',
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
        } else {
          this.loginError = response.error
        }
      } catch {
        this.loginError = 'Ошибка авторизации'
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
        } else {
          this.registerError = response.error
        }
      } catch {
        this.registerError = 'Ошибка регистрации'
      }
    },

    setUserFromLocalStorage(localStorageUser: User) {
      this.user = localStorageUser
    },
    removeUser() {
      this.user = null
      LocalStorageUser.removeLocalStorageUser()
    },
    checkLastActivity() {
      const currentActivity = new Date()
      const currentUser = LocalStorageUser.getLocalStorageUser()
      if (
        currentUser?.lastActivity &&
        currentActivity.getHours() - currentUser.lastActivity?.getHours() > 2
      ) {
        this.removeUser()
        LocalStorageUser.removeLocalStorageUser()
      } else if (currentUser?.token) {
        LocalStorageUser.setLocalStorageUser(currentUser)
      }
    },
    setRole(role: RolesTypes) {
      const currentUser = LocalStorageUser.getLocalStorageUser()

      if (this.user) {
        this.user.role = role
      }

      currentUser.role = role
      LocalStorageUser.setLocalStorageUser(currentUser)
    },
  },
})

export default useUserStore
