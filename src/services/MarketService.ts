import { Market } from '@Domain/Market'
import axios from 'axios'
import useUserStore from '@Store/user/userStore'
import getAbortedSignal from '@Utils/getAbortedSignal'
// --- GET --- //
const fetchMarkets = async (token: string): Promise<Market[] | Error> => {
  return await axios
    .get('/market/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки бирж'
      return new Error(error)
    })
}
const fetchActiveMarket = async (token: string): Promise<Market | Error> => {
  return await axios
    .get('/market/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки активной биржи'
      return new Error(error)
    })
}
const deleteMarket = async (id: string, token: string): Promise<Market | Error> => {
  return await axios
    .delete(
      `/market/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      //   {
      //     params: { id },
      //   },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления биржи'
      return new Error(error)
    })
}
const MarketService = {
  fetchMarkets,
  fetchActiveMarket,
  deleteMarket,
}
export default MarketService
