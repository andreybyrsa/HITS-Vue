import { Market } from '@Domain/Market'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const marketAxios = defineAxios(getMocks().market)

const fetchMarket = async (token: string): Promise<Market[] | Error> => {
  return await marketAxios
    .get('/market/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки бирж'
      return new Error(error)
    })
}

const MarketService = {
  fetchMarket,
}

export default MarketService
