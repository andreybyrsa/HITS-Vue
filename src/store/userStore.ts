import { defineStore } from 'pinia'
import { User, LoginUser, RegisterUser, RolesTypes } from '@Domain'
import { useNotification } from '@Hooks'
import { AuthService, InviteService } from '@Service'
import { getRouteByUserRole, localStorageUser } from '@Utils'

interface InitialState {
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),

  actions: {
    async loginUser(user: LoginUser) {
      const response = await AuthService.login(user)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      if (!response.token) {
        useNotification('Система', 'Произошла ошибка при авторизации')
        return
      }

      localStorage.setItem('token', response.token)

      localStorageUser.setLocalStorageUser(response)
      this.user = localStorageUser.getLocalStorageUser()

      this.router.push(getRouteByUserRole(response?.roles))
    },

    async registerUser(user: RegisterUser, slug: string) {
      const response = await AuthService.register(user)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      localStorageUser.setLocalStorageUser(response)
      this.user = localStorageUser.getLocalStorageUser()

      this.router.push(getRouteByUserRole(response.roles))

      await InviteService.deleteInvitationInfo(slug)
    },

    logoutUser() {
      this.user = null
      localStorageUser.removeLocalStorageUser()

      this.router.push({ name: 'login' })
    },

    setUser(user: User) {
      this.user = user
      localStorageUser.setLocalStorageUser(this.user)
    },

    setRole(role: RolesTypes) {
      if (this?.user) {
        this.user.role = role
        localStorageUser.setLocalStorageUser(this.user)
      }
    },

    checkIsExpiredToken() {
      const currentActivity = new Date()
      const currentUser = localStorageUser.getLocalStorageUser()

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
