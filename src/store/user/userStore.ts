import { defineStore } from 'pinia'
import InitialState from './initialState'

import { User, LoginUser, RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import AuthService from '@Services/AuthService'

import LocalStorageUser from '@Utils/LocalStorageUser'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
    loginError: '',
    registerError: '',
  }),
  actions: {
    async loginUser(user: LoginUser) {
      const response = await AuthService.loginUser(user)

      if (response instanceof Error) {
        const { message } = response
        return (this.loginError = message)
      }

      const localStorageUser = LocalStorageUser.setLocalStorageUser(response)
      this.user = localStorageUser

      this.loginError = ''

      this.router.push({ name: 'ideas-list' })
    },

    async registerUser(user: RegisterUser) {
      const response = await AuthService.registerUser(user)

      if (response instanceof Error) {
        const { message } = response
        return (this.registerError = message)
      }

      const localStorageUser = LocalStorageUser.setLocalStorageUser(response)
      this.user = localStorageUser

      this.registerError = ''

      this.router.push({ name: 'ideas' })
    },

    setUserFromLocalStorage(localStorageUser: User) {
      this.user = localStorageUser
    },
    removeUser() {
      this.user = null
      LocalStorageUser.removeLocalStorageUser()
      this.router.push({ name: 'login' })
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
