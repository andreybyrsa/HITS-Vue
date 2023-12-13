import axios from 'axios'

import { API_URL } from '@Main'

import Success from '@Domain/ResponseMessage'
import IdeaMarket from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'
import IdeaMarketStatusTypes from '@Domain/MarketStatus'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

function formatFavoriteIdea(ideasMarket: IdeaMarket[]) {
  return ideasMarket.filter((ideaMarket) => ideaMarket.isFavorite)
}

const ideasMarketAxios = defineAxios(getMocks().ideasMarket)

// --- GET --- //
const fetchIdeasMarket = async (token: string): Promise<IdeaMarket[] | Error> => {
  return await ideasMarketAxios
    .get('/market/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const fetchFavoritesIdeas = async (token: string): Promise<IdeaMarket[] | Error> => {
  return await ideasMarketAxios
    .get<IdeaMarket[]>(
      '/market/favorite',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { formatter: formatFavoriteIdea },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getIdeaMarket = async (
  id: string,
  token: string,
): Promise<IdeaMarket | Error> => {
  return await ideasMarketAxios
    .get<IdeaMarket>(
      `/market/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id: id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идеи'
      return new Error(error)
    })
}

const getAllInitiatorMarketIdeas = async (
  token: string,
): Promise<IdeaMarket[] | Error> => {
  return await ideasMarketAxios
    .get('/market/idea/initiator/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

// --- POST --- //
const sendIdeaOnMarket = async (
  idea: IdeaMarket[],
  token: string,
): Promise<IdeaMarket[] | Error> => {
  return await ideasMarketAxios
    .post('/market/send', idea, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки идей на биржу'
      return new Error(error)
    })
}

const postIdeaMarketTeam = async (
  id: string,
  requestToIdea: RequestTeamToIdea,
  token: string,
): Promise<IdeaMarket | Error> => {
  const { ideaMarketId, teamId } = requestToIdea
  const team = getMocks().teams.find((team) => team.id === teamId)

  return await ideasMarketAxios
    .put<IdeaMarket>(
      `${API_URL}/market/accept/request/${ideaMarketId}/${teamId}`,
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
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления команды'
      return new Error(error)
    })
}

// --- PUT --- //
const addIdeaToFavorites = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await ideasMarketAxios
    .putNoRequestBody<Success>(
      `/market/favorite/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { isFavorite: true } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки избранных идей'
      return new Error(error)
    })
}

const updateIdeaMarketStatus = async (
  id: string,
  status: IdeaMarketStatusTypes,
  token: string,
): Promise<Success | Error> => {
  return await ideasMarketAxios
    .putNoRequestBody<Success>(
      `/market/idea-status/${id}/${status}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { status: status } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки избранных идей'
      return new Error(error)
    })
}

const kickTeamFromIdeaMarket = async (ideaMarketId: string, token: string) => {
  return await ideasMarketAxios
    .putNoRequestBody(
      `/market/reset/team/${ideaMarketId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { team: null } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка исключения команды из идеи'
      return new Error(error)
    })
}

// --- DELETE --- ///
const removeIdeaFromFavorites = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await ideasMarketAxios
    .delete(
      `/market/unfavorite/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { isFavorite: false } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления избранных идей'
      return new Error(error)
    })
}

const IdeasMarketService = {
  fetchIdeasMarket,
  fetchFavoritesIdeas,
  getAllInitiatorMarketIdeas,
  getIdeaMarket,

  sendIdeaOnMarket,
  postIdeaMarketTeam,

  addIdeaToFavorites,
  updateIdeaMarketStatus,
  kickTeamFromIdeaMarket,

  removeIdeaFromFavorites,
}

export default IdeasMarketService
