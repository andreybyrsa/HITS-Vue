import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/quests/initialState'
import LaunchQuestService from '@Services/QuestService'
import { Quest } from '@Domain/Quest'

const useQuestsStore = defineStore('questsStore', {
  state: (): InitialState => ({
    quests: [],
    questsColapseData: [],
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

        this.quests = response
        return this.quests
      }
    },
    getQuestCollapseData() {
      return async (token: string) => {
        const response = await LaunchQuestService.getQuestsCollapseData(token)
        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )

          return response
        }

        this.questsColapseData = response
        return this.questsColapseData
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

      return this.quests
    },
  },
})

export default useQuestsStore
