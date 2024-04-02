import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/quests/initialState'
import QuestService from '@Services/QuestService'

const useLaunchQuestStore = defineStore('questStore', {
  state: (): InitialState => ({
    quests: [],
  }),
  getters: {
    getQuests() {
      return async (token: string) => {
        const response = await QuestService.getQuests(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.quests = response
        return this.quests
      }
    },
  },
})

export default useLaunchQuestStore
