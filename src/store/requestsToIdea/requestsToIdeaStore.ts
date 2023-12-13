import { defineStore } from 'pinia'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'

import RequestToIdeaService from '@Services/RequestToIdeaService'
import { Team } from '@Domain/Team'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import InitialState from '@Store/requestsToIdea/initialState'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'
import { Ref, ref } from 'vue'
import Success from '@Domain/ResponseMessage'

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    useNotificationsStore().createSystemNotification('Система', `${data.value}`)
  }
}

const useRequestsToIdeaStore = defineStore('requestsToIdea', {
  state: (): InitialState => ({
    requests: [],
  }),

  getters: {
    getRequestsToIdea() {
      return async (ideaId: string, token: string) => {
        const response = await RequestToIdeaService.getIdeaRequests(ideaId, token)

        if (response instanceof Error) {
          return response
        }

        this.requests = response
        return this.requests
      }
    },
  },
  actions: {
    async postRequest(team: Team, ideaId: string, letter: string, token: string) {
      const requestTeam = {
        teamId: team.id,
        ideaMarketId: ideaId,

        name: team.name,
        status: 'NEW',
        membersCount: team.membersCount,
        skills: team.skills,

        letter: letter,
      } as RequestTeamToIdea

      const response = await RequestToIdeaService.postRequest(requestTeam, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.requests.push(response)
      }
    },

    async acceptRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id, ideaMarketId, teamId } = requestToIdea
      const ideasMarketStore = useIdeasMarketStore()

      const parallelRequests = [
        () => RequestToIdeaService.updateRequestToIdeaStatus(id, 'ACCEPTED', token),
        () => ideasMarketStore.setIdeaMarketTeam(requestToIdea, token),
        () =>
          ideasMarketStore.updateIdeaMarketStatus(
            ideaMarketId,
            'RECRUITMENT_IS_CLOSED',
            token,
          ),
        () =>
          RequestToIdeaService.annulatedRequestsToIdea(teamId, 'ANNULLED', token),
      ]

      await makeParallelRequests<Error | Success | void>(parallelRequests)

      const currentRequestToIdea = this.requests.find((request) => request.id === id)
      if (currentRequestToIdea) {
        currentRequestToIdea.status = 'ACCEPTED'
      }
    },

    async withdrawRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id } = requestToIdea
      const response = await RequestToIdeaService.updateRequestToIdeaStatus(
        id,
        'WITHDRAWN',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToIdea = this.requests.find(
          (request) => request.id === id,
        )

        if (currentRequestToIdea) {
          currentRequestToIdea.status = 'WITHDRAWN'
        }
      }
    },

    async cancelRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id } = requestToIdea
      const response = await RequestToIdeaService.updateRequestToIdeaStatus(
        id,
        'CANCELED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToIdea = this.requests.find(
          (request) => request.id === id,
        )

        if (currentRequestToIdea) {
          currentRequestToIdea.status = 'CANCELED'
        }
      }
    },
  },
})

export default useRequestsToIdeaStore
