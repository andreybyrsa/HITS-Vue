import { defineStore } from 'pinia'

import { User } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/user/initialState'

import LocalStorageUser from '@Utils/LocalStorageUser'
import { getRouteByUserRole } from '@Utils/userRolesInfo'

import LoginService from '@Services/LoginService'
import ProfileService from '@Services/ProfileService'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async loginUser() {
      const response: User = await LoginService.getTokenInfo()

      const token: string = sessionStorage.getItem('access_token') || ''

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.user = response

        this.user.token = token

        LocalStorageUser.setLocalStorageUser(this.user)

        await ProfileService.checkProfile(token)

        this.router.push(getRouteByUserRole(response.roles))
      }
    },

    async logoutUser() {
      this.user = null
      LocalStorageUser.removeLocalStorageUser()
      sessionStorage.clear()

      await LoginService.logout()
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
