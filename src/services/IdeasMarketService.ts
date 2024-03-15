import axios from 'axios'

import { API_URL, MODE } from '@Main'

import Success from '@Domain/ResponseMessage'
import {
  IdeaMarket,
  IdeaMarketAdvertisement,
  IdeaMarketStatusType,
} from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Idea } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import {
  ideaMarketAdvertisementsMocks,
  ideasMarketMocks,
  ideasSkillsMocks,
  teamsMocks,
  usersMocks,
} from '@Utils/getMocks'
import { Team } from '@Domain/Team'

const ideasMarketAxios = defineAxios(ideasMarketMocks)
const ideasMarketAdvertisementAxios = defineAxios(ideaMarketAdvertisementsMocks)

function formatFavoriteIdea(ideasMarket: IdeaMarket[]) {
  return ideasMarket.filter((ideaMarket) => ideaMarket.isFavorite)
}

function formatIdeaMarket(ideasMarket: IdeaMarket[], marketId: string) {
  return ideasMarket.filter((idea) => idea.marketId === marketId)
}

function formatIdeaInitiatorMarket(ideasMarket: IdeaMarket[]) {
  return ideasMarket.filter((idea) => idea.initiator.id === useUserStore().user?.id)
}

function formatIdeaByInitiator(ideasMarket: IdeaMarket[], userId: string) {
  return ideasMarket.filter(({ initiator }) => initiator.id === userId)
}

function formatAdvertisementsByIdeaId(
  ideaMarketAdvertisements: IdeaMarketAdvertisement[],
  ideaMarketId: string,
) {
  return ideaMarketAdvertisements.filter(
    (advertisement) => advertisement.ideaMarketId === ideaMarketId,
  )
}

// --- GET --- //
const fetchIdeasMarket = async (
  marketId: string,
  token: string,
): Promise<IdeaMarket[] | Error> => {
  return ideasMarketAxios
    .get<IdeaMarket[] | Error>(
      `/ideas-service/market/idea/market/${marketId}/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (markets) => formatIdeaMarket(markets, marketId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идей на бирже'))
}

const fetchFavoritesIdeas = async (
  marketId: string,
  token: string,
): Promise<IdeaMarket[] | Error> => {
  return ideasMarketAxios
    .get<IdeaMarket[]>(
      `/ideas-service/market/idea/favourite/${marketId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { formatter: formatFavoriteIdea },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки избранных идей'))
}

const getIdeaMarket = async (
  id: string,
  token: string,
): Promise<IdeaMarket | Error> => {
  return ideasMarketAxios
    .get<IdeaMarket>(
      `/ideas-service/market/idea/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id: id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идеи'))
}

const getAllInitiatorMarketIdeas = async (
  marketId: string,
  token: string,
): Promise<IdeaMarket[] | Error> => {
  return ideasMarketAxios
    .get<IdeaMarket[]>(
      `/ideas-service/market/idea/market/${marketId}/initiator`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        formatter: (markets) => formatIdeaInitiatorMarket(markets),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идей на бирже'))
}

const getIdeaMarketAdvertisements = async (
  ideaMarketId: string,
  token: string,
): Promise<IdeaMarketAdvertisement[] | Error> => {
  return ideasMarketAdvertisementAxios
    .get<IdeaMarketAdvertisement[]>(
      `/ideas-service/market/idea/get/advertisements/${ideaMarketId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (advertisements) =>
          formatAdvertisementsByIdeaId(advertisements, ideaMarketId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки объявлений'))
}

const getAllInitiatorMarketIdeasByUserId = async (
  userId: string,
  token: string,
): Promise<IdeaMarket[] | Error> => {
  return ideasMarketAxios
    .get<IdeaMarket[]>(
      `/ideas-service/idea/invitation/idea-market`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (ideasMarket) => formatIdeaByInitiator(ideasMarket, userId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идей инициатора'))
}

// --- POST --- //
const sendIdeaOnMarket = async (
  marketId: string,
  ideas: Idea[],
  token: string,
): Promise<IdeaMarket[] | Error> => {
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

    return ideasMarketAxios
      .post(`/ideas-service/market/idea/send/${marketId}`, ideasMarket, {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      })
      .then((response) => response.data)
      .catch((error) => handleAxiosError(error, 'Ошибка отправки идей на биржу'))
  }

  return axios
    .post(`${API_URL}/ideas-service/market/idea/send/${marketId}`, ideas, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки идей на биржу'))
}

const postIdeaMarketTeam = async (
  id: string,
  requestToIdea: RequestTeamToIdea,
  token: string,
): Promise<IdeaMarket | Error> => {
  const { ideaMarketId, teamId } = requestToIdea
  const team = teamsMocks.find((team) => team.id === teamId)

  return ideasMarketAxios
    .put<IdeaMarket>(
      `${API_URL}/ideas-service/market/accept/request/${ideaMarketId}/${teamId}`,
      { team: team },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления команды'))
}

const addIdeaMarketTeam = async (
  id: string,
  team: Team,
  token: string,
): Promise<IdeaMarket | Error> => {
  return ideasMarketAxios
    .put<IdeaMarket>(
      `${API_URL}/ideas-service/market/accept`,
      { team: team },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления команды'))
}

const postIdeaMarketAdvertisement = async (
  ideaMarketAdvertisement: IdeaMarketAdvertisement,
  token: string,
): Promise<IdeaMarketAdvertisement | Error> => {
  return ideasMarketAdvertisementAxios
    .post('/ideas-service/market/idea/add/advertisement', ideaMarketAdvertisement, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления объявления'))
}

// --- PUT --- //
const addIdeaToFavorites = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return ideasMarketAxios
    .putNoRequestBody<Success>(
      `/ideas-service/market/idea/favorite/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { isFavorite: true } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления идеи в избранное'))
}

const updateIdeaMarketStatus = async (
  id: string,
  status: IdeaMarketStatusType,
  token: string,
): Promise<Success | Error> => {
  return ideasMarketAxios
    .putNoRequestBody<Success>(
      `/ideas-service/market/idea/idea-status/${id}/${status}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { status: status } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка обновления статуса идеи на бирже'),
    )
}

const kickTeamFromIdeaMarket = async (ideaMarketId: string, token: string) => {
  return ideasMarketAxios
    .putNoRequestBody(
      `/ideas-service/market/reset/team/${ideaMarketId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { team: null } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка исключения команды из идеи'))
}

const checkIdeaMarketAdvertisement = async (
  ideaMarketAdvertisement: IdeaMarketAdvertisement,
  token: string,
): Promise<void | Error> => {
  const { id } = ideaMarketAdvertisement

  return ideasMarketAdvertisementAxios
    .putNoRequestBody<void>(
      `/ideas-service/market/idea/check/advertisement/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: ideaMarketAdvertisement },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка просмотра объявления'))
}

// --- DELETE --- ///
const removeIdeaFromFavorites = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return ideasMarketAxios
    .delete(
      `/ideas-service/market/idea/unfavorite/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { isFavorite: false } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления избранных идей'))
}

const deleteIdeaMarketAdvertisement = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return ideasMarketAdvertisementAxios
    .delete(
      `/ideas-service/market/idea/delete/advertisement/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления объявления'))
}

const IdeasMarketService = {
  fetchIdeasMarket,
  fetchFavoritesIdeas,
  getAllInitiatorMarketIdeas,
  getIdeaMarket,
  getIdeaMarketAdvertisements,
  getAllInitiatorMarketIdeasByUserId,

  sendIdeaOnMarket,
  postIdeaMarketTeam,
  postIdeaMarketAdvertisement,

  addIdeaToFavorites,
  updateIdeaMarketStatus,
  kickTeamFromIdeaMarket,
  checkIdeaMarketAdvertisement,
  addIdeaMarketTeam,

  removeIdeaFromFavorites,
  deleteIdeaMarketAdvertisement,
}

export default IdeasMarketService
