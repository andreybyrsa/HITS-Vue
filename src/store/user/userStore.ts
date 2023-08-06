import { defineStore } from 'pinia'
import InitialState from './initialState'

import { User, LoginUser, RegisterUser } from '@Domain/User'

import AuthService from '@Services/AuthService'
import getLocalStorageUser from '@Utils/getLocalStorageUser'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async loginUser(user: LoginUser) {
      try {
        const response = await AuthService.loginUser(user)

        if (response.token) {
          const localStorageUser: User = {
            ...response,
            lastActivity: new Date(),
          }

          this.user = localStorageUser
          localStorage.setItem('user', JSON.stringify(localStorageUser))

          this.router.push({ name: 'dev' })
        }
      } catch (error) {
        console.warn(error)
      }
    },
    async registerUser(user: RegisterUser) {
      this.user = await AuthService.registerUser(user)
    },
    setUserFromLocalStorage(localStorageUser: User) {
      this.user = localStorageUser
    },
    removeUser() {
      this.user = null
    },

    checkLastActivity() {
      const currentActivity = new Date()
      const currentUser: User = getLocalStorageUser()
      if (
        currentUser?.lastActivity &&
        currentActivity.getMinutes() - currentUser.lastActivity?.getMinutes() >
          10
      ) {
        this.removeUser()
        localStorage.removeItem('user')
      } else if (currentUser?.token) {
        const localStorageUser: User = {
          ...currentUser,
          lastActivity: new Date(),
        }
        localStorage.setItem('user', JSON.stringify(localStorageUser))
      }
    },
  },
})

export default useUserStore
