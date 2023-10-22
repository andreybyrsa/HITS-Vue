import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import Success from '@Domain/ResponseMessage'

import { Idea } from '@Domain/Idea'

const ideasMarketAxios = defineAxios(getMocks().ideasMarket)

const fetchIdeasMarket = async (token: string): Promise<Idea[] | Error> => {
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

const postIdeaOnMarket = async (
  ideas: Idea[],
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
  postIdeaOnMarket,
}

export default IdeasMarketService
