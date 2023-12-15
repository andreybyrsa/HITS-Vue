import { Market } from '@Domain/Market'
import { API_URL } from '@Main'
import axios from 'axios'

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
    .get(`${API_URL}/market/active`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки активной биржи'
      return new Error(error)
    })
}

const MarketService = {
  fetchMarkets,
  fetchActiveMarket,
}

export default MarketService
