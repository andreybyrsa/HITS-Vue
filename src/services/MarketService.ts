import { Market } from '@Domain/Market'
import useUserStore from '@Store/user/userStore'
import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import getMocks from '@Utils/getMocks'

const marketAxios = defineAxios(getMocks().markets)

function formatMarketActive(teams: Market[]) {
  return teams.find(({ status }) => status === 'ACTIVE')
}

// --- GET --- //
const fetchMarkets = async (token: string): Promise<Market[] | Error> => {
  return await marketAxios
    .get('/market/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки бирж'
      return new Error(error)
    })
}

const fetchActiveMarket = async (token: string): Promise<Market | Error> => {
  return await marketAxios
    .get(
      `/market/active`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (markets) => formatMarketActive(markets),
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки активных биржи'
      return new Error(error)
    })
}

const getMarket = async (id: string, token: string): Promise<Market | Error> => {
  return await marketAxios
    .get(
      `/market/${id}`,
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
      const error = response?.data?.error ?? 'Ошибка загрузки активных биржи'
      return new Error(error)
    })
}

const MarketService = {
  fetchMarkets,
  fetchActiveMarket,
  getMarket,
}

export default MarketService
