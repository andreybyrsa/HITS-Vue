import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/quests/initialState'
import QuestService from '@Services/QuestService'

const useLaunchQuestStore = defineStore('questStore', {
  state: (): InitialState => ({
    questsShort: [],
    questsLong: [],
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

        this.questsShort = response
        return this.questsShort
      }
    },
    getQuestsLong() {
      return async (token: string) => {
        const response = await QuestService.getQuestsLong(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.questsLong = response
        return this.questsLong
      }
    },
  },
})

export default useLaunchQuestStore
