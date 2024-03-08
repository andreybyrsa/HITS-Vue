import { Team, Success, RequestTeamToIdea, RequestToIdeaStatus } from '@Domain'
import { defineAxios, RequestTeamsMocks } from '@Utils'

const defineApi = defineAxios(RequestTeamsMocks)

const filterRequestsToIdeaByIdeaId = (
  ideaId: string,
  request: RequestTeamToIdea[],
) => {
  return request.filter((request) => request.ideaMarketId === ideaId)
}

export class RequestToIdeaService {
  static async getIdeaRequests(
    ideaId: string,
  ): Promise<RequestTeamToIdea[] | Error> {
    const response = await defineApi.get<RequestTeamToIdea[]>(
      `/market/idea/requests/${ideaId}`,
      {},
      {
        formatter: (applications) =>
          filterRequestsToIdeaByIdeaId(ideaId, applications),
      },
    )
    return response.data
  }

  static async postRequest(
    team: RequestTeamToIdea,
  ): Promise<RequestTeamToIdea | Error> {
    const response = await defineApi.post(`/market/idea/declare`, team, {})
    return response.data
  }

  static async updateRequestToIdeaStatus(
    id: string,
    status: RequestToIdeaStatus,
  ): Promise<Success | Error> {
    const response = await defineApi.put<Success>(
      `/market/idea/change-status/request/${id}/${status}`,
      { status: status },
      {},
      {
        params: { id },
        responseData: { success: 'Успешное изменение статуса' },
      },
    )
    return response.data
  }

  static async acceptRequestToIdeaStatus(
    id: string,
    teamId: string,
  ): Promise<Team | Error> {
    const response = await defineApi.putNoRequestBody<Team>(
      `/market/idea/accept/request/${id}/${teamId}`,
      {},
      {
        params: { id },
      },
    )
    return response.data
  }

  static async deleteRequestTeams(id: string): Promise<Success | Error> {
    const response = await defineApi.delete(
      `/market/delete/request/${id}`,
      {},
      {
        params: { id },
      },
    )
    return response.data
  }
}
