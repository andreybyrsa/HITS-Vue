import { Market, MarketStatus } from '@Domain/Market'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const marketAxios = defineAxios(getMocks().market)

// --- GET --- ///
const fetchMarkets = async (token: string): Promise<Market[] | Error> => {
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

const fetchMarket = async (token: string): Promise<Market[] | Error> => {
  return await marketAxios
    .get('/market/active', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки биржи'
      return new Error(error)
    })
}

// --- POST --- ///
const createMarket = async (
  market: Market,
  token: string,
): Promise<Market | Error> => {
  return await marketAxios
    .post('/market/create', market, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания биржи'
      return new Error(error)
    })
}

// --- DELETE --- ///
const deleteMarket = async (id: string, token: string): Promise<Success | Error> => {
  return await marketAxios
    .delete(
      `/market/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления биржи'
      return new Error(error)
    })
}

// --- PUT --- ///
const updateMarket = async (
  market: Market,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await marketAxios
    .put<Success>(
      `/market/update/${id}`,
      market,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное обновление биржи' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования биржи'
      return new Error(error)
    })
}

const updateMarketStatus = async (
  id: string,
  status: MarketStatus,
  token: string,
): Promise<Success | Error> => {
  return await marketAxios
    .putNoRequestBody<Success>(
      `/market/status/${id}/${status}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки статуса биржи'
      return new Error(error)
    })
}

const MarketService = {
  fetchMarkets,
  fetchMarket,
  createMarket,
  deleteMarket,
  updateMarket,
  updateMarketStatus,
}

export default MarketService
