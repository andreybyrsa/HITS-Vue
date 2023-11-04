import { defineStore } from 'pinia'
import InitialState from './initialState'

import { User, LoginUser, RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import AuthService from '@Services/AuthService'
import InvitationService from '@Services/InvitationService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

import LocalStorageUser from '@Utils/LocalStorageUser'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  getters: {
    currentUser(): User | null {
      return this.user
    },
  },
  actions: {
    async loginUser(user: LoginUser) {
      const response = await AuthService.loginUser(user)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const localStorageUser = LocalStorageUser.setLocalStorageUser(response)
        this.user = localStorageUser

        this.router.push({ name: 'ideas-list' })
      }
    },

    async registerUser(user: RegisterUser, slug: string) {
      const response = await AuthService.registerUser(user)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const localStorageUser = LocalStorageUser.setLocalStorageUser(response)
        this.user = localStorageUser

        this.router.push({ name: 'ideas-list' })

        await InvitationService.deleteInvitationInfo(slug)
      }
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
