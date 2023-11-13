import { defineStore } from 'pinia'

import { User, LoginUser, RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import AuthService from '@Services/AuthService'
import InvitationService from '@Services/InvitationService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/user/initialState'

import LocalStorageUser from '@Utils/LocalStorageUser'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
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

    logoutUser() {
      this.user = null
      LocalStorageUser.removeLocalStorageUser()

      this.router.push({ name: 'login' })
    },

    setUser(user: User) {
      this.user = user
    },
    setRole(role: RolesTypes) {
      if (this.user) {
        this.user.role = role
        LocalStorageUser.setLocalStorageUser(this.user)
      }
    },

    checkIsExpiredToken() {
      const currentActivity = new Date()
      const currentUser = LocalStorageUser.getLocalStorageUser()

      if (currentUser?.lastLogin) {
        const activityDifference =
          (currentActivity.getTime() - currentUser.lastLogin.getTime()) /
          (1000 * 60 * 60)

        if (activityDifference > 24) {
          this.logoutUser()

          return true
        }
        return false
      }
      return true
    },
  },
})

export default useUserStore
