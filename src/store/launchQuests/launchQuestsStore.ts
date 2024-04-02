import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/launchQuests/initialState'
import LaunchQuestService from '@Services/LaunchQuestService'

const useLaunchQuestStore = defineStore('lauchQuestStore', {
  state: (): InitialState => ({
    launchQuests: [],
  }),
  getters: {
    getLaunchQuests() {
      return async (token: string) => {
        const response = await LaunchQuestService.getLaunchQuests(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.launchQuests = response
        return this.launchQuests
      }
    },
  },
})

export default useLaunchQuestStore
