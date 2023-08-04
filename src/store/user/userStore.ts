import { defineStore } from 'pinia'
import InitialState from './initialState'

import AuthService from '@Services/AuthService'

const useUserStore = defineStore('user', {
  state: (): InitialState => ({
    user: null,
  }),
  actions: {
    async loginUser(username: string) {
      this.user = await AuthService.loginUser(username)
    },
    async registerUser(user: {
      username: string
      firstName: string
      lastName: string
      password: string
      token: string
      roles: string[]
      role: string
    }) {
      this.user = await AuthService.registerUser(user)
    },
  },
})

export default useUserStore
