import { api } from '@Api'
import { MODE } from '@Config'
import {
  Success,
  IdeaMarket,
  IdeaMarketAdvertisement,
  IdeaMarketStatusType,
  RequestTeamToIdea,
  Idea,
  Team,
} from '@Domain'
import { useUserStore } from '@Store'
import {
  TryCatch,
  defineAxios,
  ideaMarketAdvertisementsMocks,
  ideasMarketMocks,
  ideasSkillsMocks,
  teamsMocks,
  usersMocks,
} from '@Utils'

const ideasMarketDefineApi = defineAxios(ideasMarketMocks)
const ideasMarketAdvertisementDefineApi = defineAxios(ideaMarketAdvertisementsMocks)

const formatFavoriteIdea = (ideasMarket: IdeaMarket[]) => {
  return ideasMarket.filter((ideaMarket) => ideaMarket.isFavorite)
}

const formatIdeaMarket = (ideasMarket: IdeaMarket[], marketId: string) => {
  return ideasMarket.filter((idea) => idea.marketId === marketId)
}

const formatIdeaInitiatorMarket = (ideasMarket: IdeaMarket[]) => {
  return ideasMarket.filter((idea) => idea.initiator.id === useUserStore().user?.id)
}

const formatIdeaByInitiator = (ideasMarket: IdeaMarket[], userId: string) => {
  return ideasMarket.filter(({ initiator }) => initiator.id === userId)
}

const formatAdvertisementsByIdeaId = (
  ideaMarketAdvertisements: IdeaMarketAdvertisement[],
  ideaMarketId: string,
) => {
  return ideaMarketAdvertisements.filter(
    (advertisement) => advertisement.ideaMarketId === ideaMarketId,
  )
}

export class IdeaMarketService {
  @TryCatch
  static async fetchIdeasMarket(marketId: string): Promise<IdeaMarket[] | Error> {
    const response = await ideasMarketDefineApi.get<IdeaMarket[] | Error>(
      `/market/idea/market/${marketId}/all`,
      {},
      {
        formatter: (markets) => formatIdeaMarket(markets, marketId),
      },
    )
    return response.data
  }

  @TryCatch
  static async fetchFavoritesIdeas(marketId: string): Promise<IdeaMarket[] | Error> {
    const response = await ideasMarketDefineApi.get<IdeaMarket[]>(
      `/market/idea/favourite/${marketId}`,
      {},
      { formatter: formatFavoriteIdea },
    )
    return response.data
  }

  @TryCatch
  static async getIdeaMarket(id: string): Promise<IdeaMarket | Error> {
    const response = await ideasMarketDefineApi.get<IdeaMarket>(
      `/market/idea/${id}`,
      {},
      { params: { id: id } },
    )
    return response.data
  }

  @TryCatch
  static async getAllInitiatorMarketIdeas(
    marketId: string,
  ): Promise<IdeaMarket[] | Error> {
    const response = await ideasMarketDefineApi.get<IdeaMarket[]>(
      `/market/idea/market/${marketId}/initiator`,
      {},
      {
        formatter: (markets) => formatIdeaInitiatorMarket(markets),
      },
    )
    return response.data
  }

  @TryCatch
  static async getAllInitiatorMarketIdeasByUserId(
    userId: string,
  ): Promise<IdeaMarket[] | Error> {
    const response = await ideasMarketDefineApi.get<IdeaMarket[]>(
      '/idea/invitation/idea-market',
      {},
      {
        formatter: (ideasMarket) => formatIdeaByInitiator(ideasMarket, userId),
      },
    )
    return response.data
  }

  @TryCatch
  static async getIdeaMarketAdvertisements(
    ideaMarketId: string,
  ): Promise<IdeaMarketAdvertisement[] | Error> {
    const response = await ideasMarketAdvertisementDefineApi.get<
      IdeaMarketAdvertisement[]
    >(
      `/market/idea/get/advertisements/${ideaMarketId}`,
      {},
      {
        formatter: (advertisements) =>
          formatAdvertisementsByIdeaId(advertisements, ideaMarketId),
      },
    )
    return response.data
  }

  @TryCatch
  static async sendIdeaOnMarket(
    marketId: string,
    ideas: Idea[],
  ): Promise<IdeaMarket[] | Error> {
    if (MODE === 'DEVELOPMENT') {
      const ideasMarket = ideas.map((idea) => {
        return {
          id: '',
          ideaId: idea.id,
          marketId: marketId,
          initiator: usersMocks.find(({ id }) => id === idea.initiator.id),
          createdAt: idea.createdAt,
          name: idea.name,
          problem: idea.problem,
          description: idea.description,
          solution: idea.solution,
          result: idea.result,
          maxTeamSize: idea.maxTeamSize,
          customer: idea.customer,

          position: 0,
          team: null,
          stack: ideasSkillsMocks.find(({ ideaId }) => ideaId === idea.id)?.skills,
          status: 'RECRUITMENT_IS_OPEN',
          requests: 0,
          acceptedRequests: 0,
          isFavorite: false,
        }
      }) as IdeaMarket[]

      const response = await ideasMarketDefineApi.post(
        `/market/idea/send/${marketId}`,
        ideasMarket,
        {},
      )
      return response.data
    }

    const response = await api.post(`/market/idea/send/${marketId}`, ideas)
    return response.data
  }

  @TryCatch
  static async postIdeaMarketTeam(
    id: string,
    requestToIdea: RequestTeamToIdea,
  ): Promise<IdeaMarket | Error> {
    const { ideaMarketId, teamId } = requestToIdea
    const team = teamsMocks.find((team) => team.id === teamId)

    const response = await ideasMarketDefineApi.put<IdeaMarket>(
      `/market/accept/request/${ideaMarketId}/${teamId}`,
      { team: team },
      {},
      {
        params: { id },
      },
    )
    return response.data
  }

  @TryCatch
  static async addIdeaMarketTeam(
    id: string,
    team: Team,
  ): Promise<IdeaMarket | Error> {
    const response = await ideasMarketDefineApi.put<IdeaMarket>(
      '/market/accept',
      { team: team },
      {},
      {
        params: { id },
      },
    )
    return response.data
  }

  @TryCatch
  static async postIdeaMarketAdvertisement(
    ideaMarketAdvertisement: IdeaMarketAdvertisement,
  ): Promise<IdeaMarketAdvertisement | Error> {
    const response = await ideasMarketAdvertisementDefineApi.post(
      '/market/idea/add/advertisement',
      ideaMarketAdvertisement,
    )
    return response.data
  }

  @TryCatch
  static async addIdeaToFavorites(id: string): Promise<Success | Error> {
    const response = await ideasMarketDefineApi.putNoRequestBody<Success>(
      `/market/idea/favorite/${id}`,
      {},
      { params: { id }, requestData: { isFavorite: true } },
    )
    return response.data
  }

  @TryCatch
  static async updateIdeaMarketStatus(
    id: string,
    status: IdeaMarketStatusType,
  ): Promise<Success | Error> {
    const response = await ideasMarketDefineApi.putNoRequestBody<Success>(
      `/market/idea-status/${id}/${status}`,
      {},
      { params: { id }, requestData: { status: status } },
    )
    return response.data
  }

  @TryCatch
  static async kickTeamFromIdeaMarket(ideaMarketId: string) {
    const response = await ideasMarketDefineApi.putNoRequestBody(
      `/market/reset/team/${ideaMarketId}`,
      {},
      { params: { team: null } },
    )
    return response.data
  }

  @TryCatch
  static async checkIdeaMarketAdvertisement(
    ideaMarketAdvertisement: IdeaMarketAdvertisement,
  ): Promise<void | Error> {
    const { id } = ideaMarketAdvertisement

    const response = await ideasMarketAdvertisementDefineApi.putNoRequestBody<void>(
      `/market/idea/check/advertisement/${id}`,
      {},
      { params: { id }, requestData: ideaMarketAdvertisement },
    )
    return response.data
  }

  @TryCatch
  static async removeIdeaFromFavorites(id: string): Promise<Success | Error> {
    const response = await ideasMarketDefineApi.delete(
      `/market/idea/unfavorite/${id}`,
      {},
      { params: { id }, requestData: { isFavorite: false } },
    )
    return response.data
  }

  @TryCatch
  static async deleteIdeaMarketAdvertisement(id: string): Promise<Success | Error> {
    const response = await ideasMarketAdvertisementDefineApi.delete(
      `/market/idea/delete/advertisement/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
