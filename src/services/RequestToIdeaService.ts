import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'
import Success from '@Domain/ResponseMessage'
import { Team } from '@Domain/Team'
import { RequestTeamsMocks } from '@Utils/getMocks'
import defineAxios from '@Utils/defineAxios'

const defineApi = defineAxios(RequestTeamsMocks)

const filterRequestsToIdeaByIdeaId = (
  ideaId: string,
  request: RequestTeamToIdea[],
) => {
  return request.filter((request) => request.ideaMarketId === ideaId)
}

const getIdeaRequests = async (
  ideaId: string,
): Promise<RequestTeamToIdea[] | Error> => {
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

const postRequest = async (
  team: RequestTeamToIdea,
): Promise<RequestTeamToIdea | Error> => {
  const response = await defineApi.post(`/market/idea/declare`, team, {})
  return response.data
}

const updateRequestToIdeaStatus = async (
  id: string,
  status: RequestToIdeaStatus,
): Promise<Success | Error> => {
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

const acceptRequestToIdeaStatus = async (
  id: string,
  teamId: string,
): Promise<Team | Error> => {
  const response = await defineApi.putNoRequestBody<Team>(
    `/market/idea/accept/request/${id}/${teamId}`,
    {},
    {
      params: { id },
    },
  )
  return response.data
}

const deleteRequestTeams = async (id: string): Promise<Success | Error> => {
  const response = await defineApi.delete(
    `/market/delete/request/${id}`,
    {},
    {
      params: { id },
    },
  )
  return response.data
}

export const RequestTeamsServise = {
  getIdeaRequests,
  postRequest,
  updateRequestToIdeaStatus,
  acceptRequestToIdeaStatus,
  deleteRequestTeams,
}
