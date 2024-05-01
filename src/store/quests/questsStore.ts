import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/quests/initialState'
import LaunchQuestService from '@Services/QuestService'
import { Quest } from '@Domain/Quest'

const useQuestsStore = defineStore('questsStore', {
  state: (): InitialState => ({
    Quests: [],
  }),
  getters: {
    getQuests() {
      return async (token: string) => {
        const response = await LaunchQuestService.getQuests(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.Quests = response
        return this.Quests
      }
    },
  },
  actions: {
    async postQuest(launchQuest: Quest, token: string) {
      const response = await LaunchQuestService.postQuest(launchQuest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      return this.Quests
    },
  },
})

export default useQuestsStore
