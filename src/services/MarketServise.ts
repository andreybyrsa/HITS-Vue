import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import Success from '@Domain/ResponseMessage'

import IdeasMarket from '@Domain/IdeasMarket'

const ideasMarketAxios = defineAxios(getMocks().IdeasMarket)

const fetchIdeasMarket = async (token: string): Promise<IdeasMarket[] | Error> => {
  return await ideasMarketAxios
    .get('/ideas/market/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getIdeaMarket = async (
  token: string,
  id: string,
): Promise<IdeasMarket | Error> => {
  return await ideasMarketAxios
    .get(
      `/ideas/market/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идеи'
      return new Error(error)
    })
}

const postIdeaOnMarket = async (
  ideas: IdeasMarket,
  token: string,
): Promise<Success | Error> => {
  return await ideasMarketAxios
    .post<Success>(
      '/ideas/market/add',
      ideas,
      { headers: { Authorization: `Bearer ${token}` } },
      { responseData: { success: 'Успешное добавление идеи' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки идей на биржу'
      return new Error(error)
    })
}

const IdeasMarketService = {
  fetchIdeasMarket,
  getIdeaMarket,

  postIdeaOnMarket,
}

export default IdeasMarketService
