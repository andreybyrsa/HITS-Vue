import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/quests/initialState'
import QuestService from '@Services/QuestService'
import { Quest, QuestShort } from '@Domain/Quest'

const useQuestsStore = defineStore('questsStore', {
  state: (): InitialState => ({
    quests: [],
    quest: null,
  }),
  actions: {
    async getQuests(token: string): Promise<QuestShort[] | Error> {
      const response = await QuestService.getQuests(token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.quests = response
      return this.quests
    },

    async getQuest(idQuest: string, token: string): Promise<Quest | Error> {
      const response = await QuestService.getQuest(idQuest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.quest = response
      return this.quest
    },

    async postQuest(quest: Quest, token: string): Promise<Quest | Error> {
      const response = await QuestService.postQuest(quest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.quests.push(response)
      return response
    },
  },
})

export default useQuestsStore
