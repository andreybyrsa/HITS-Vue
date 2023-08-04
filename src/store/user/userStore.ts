import { defineStore } from 'pinia'
import InitialState from './initialState'

import AuthService from '@Services/AuthService'
import { LoginUser } from '@Domain/User'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async loginUser(user: LoginUser) {
      this.user = await AuthService.loginUser(user)
    },
    removeUser() {
      this.user = null
    },
  },
})

export default useUserStore
