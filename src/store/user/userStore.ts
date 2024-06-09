import { defineStore } from 'pinia'

import { User, LoginUser, RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import InvitationService from '@Services/InvitationService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/user/initialState'

import LocalStorageUser from '@Utils/LocalStorageUser'
import { getRouteByUserRole } from '@Utils/userRolesInfo'
import ProfileService from '@Services/ProfileService'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async checkProfile() {
      const response = await ProfileService.checkProfile()

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        LocalStorageUser.setLocalStorageUser(response)
        this.user = LocalStorageUser.getLocalStorageUser()

        this.router.push(getRouteByUserRole(response.roles))
      }
    },

    logoutUser() {
      this.user = null
      LocalStorageUser.removeLocalStorageUser()

      this.router.push({ name: 'login' })
    },

    setUser(user: User) {
      this.user = user
      LocalStorageUser.setLocalStorageUser(this.user)
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
