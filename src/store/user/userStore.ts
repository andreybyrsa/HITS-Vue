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
  },
})

export default useUserStore
