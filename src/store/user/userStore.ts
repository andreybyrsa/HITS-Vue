import { defineStore } from 'pinia'

import { LoginUser, RegisterUser, UserMetadata } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import AuthService from '@Services/AuthService'
import InvitationService from '@Services/InvitationService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/user/initialState'

import LocalStorageUser from '@Utils/LocalStorageUser'
import { getRouteByUserRole } from '@Utils/userRolesInfo'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
    metadata: null,
  }),
  actions: {
    async loginUser(user: LoginUser) {
      const response = await AuthService.loginUser(user)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        if (!response.token) return
        const metadata: UserMetadata = {
          token: response.token,
          lastLogin: new Date(),
        }
        LocalStorageUser.setMetadata(metadata)
        this.metadata = metadata
        this.user = response

        this.router.push(getRouteByUserRole(response.roles))
      }
    },

    async getMe() {
      const response = await AuthService.getMe()

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }
      this.user = response
    },

    async registerUser(user: RegisterUser, slug: string) {
      const response = await AuthService.registerUser(user)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        if (!response.token) return
        const metadata: UserMetadata = {
          token: response.token,
          lastLogin: new Date(),
        }
        LocalStorageUser.setMetadata(metadata)
        this.metadata = metadata

        this.user = response

        this.router.push(getRouteByUserRole(response.roles))

        await InvitationService.deleteInvitationInfo(slug)
      }
    },

    logoutUser() {
      this.user = null
      this.metadata = null
      LocalStorageUser.removeMetadata()

      this.router.push({ name: 'login' })
    },

    setUserMetadata(userMetadata: UserMetadata) {
      LocalStorageUser.setMetadata(userMetadata)
    },

    setRole(role: RolesTypes) {
      if (this.user) {
        this.user.role = role
      }
    },

    checkIsExpiredToken() {
      const currentActivity = new Date()
      const currentUserMetadata = LocalStorageUser.getMetadata()

      if (currentUserMetadata?.lastLogin) {
        const activityDifference =
          (currentActivity.getTime() -
            new Date(currentUserMetadata.lastLogin).getTime()) /
          (1000 * 60 * 60)

        if (activityDifference > 4) {
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
