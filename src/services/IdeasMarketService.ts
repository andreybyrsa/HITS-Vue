import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import Success from '@Domain/ResponseMessage'
import IdeasMarket from '@Domain/IdeasMarket'
import getAbortedSignal from '@Utils/getAbortedSignal'
import useUserStore from '@Store/user/userStore'

function formatFavoriteIdea(ideasMarket: IdeasMarket[]) {
  return ideasMarket.filter((ideaMarket) => ideaMarket.isFavorite)
}

const ideasMarketAxios = defineAxios(getMocks().ideasMarket)

const fetchIdeasMarket = async (token: string): Promise<IdeasMarket[] | Error> => {
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

const fetchFavoritesIdeas = async (
  token: string,
): Promise<IdeasMarket[] | Error> => {
  return await ideasMarketAxios
    .get<IdeasMarket[]>(
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
): Promise<IdeasMarket | Error> => {
  return await ideasMarketAxios
    .get<IdeasMarket>(
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
): Promise<IdeasMarket[] | Error> => {
  return await ideasMarketAxios
    .get('/market/initiator/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const sendIdeaOnMarket = async (
  idea: IdeasMarket[],
  token: string,
): Promise<IdeasMarket[] | Error> => {
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
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

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
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const IdeasMarketService = {
  fetchIdeasMarket,
  getIdeaMarket,
  sendIdeaOnMarket,
  fetchFavoritesIdeas,
  addIdeaToFavorites,
  removeIdeaFromFavorites,
  getAllInitiatorMarketIdeas,
}

export default IdeasMarketService