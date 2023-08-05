import { defineStore } from 'pinia'
import InitialState from './initialState'

import { LoginUser, RegisterUser } from '@Domain/User'

import AuthService from '@Services/AuthService'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async loginUser(user: LoginUser) {
      this.user = await AuthService.loginUser(user)
    },
    async registerUser(user: RegisterUser) {
      this.user = await AuthService.registerUser(user)
    },
    removeUser() {
      this.user = null
    },
  },
})

export default useUserStore
