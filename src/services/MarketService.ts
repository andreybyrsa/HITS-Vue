import { Market, MarketStatus } from '@Domain/Market'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import getMocks from '@Utils/getMocks'

const marketAxios = defineAxios(getMocks().market)

function formatMarketsByActiveStatus(markets: Market[]) {
  return markets.filter(({ status }) => status === 'ACTIVE')
}

// --- GET --- //
const getAllMarkets = async (token: string): Promise<Market[] | Error> => {
  return marketAxios
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

const getAllActiveMarkets = async (token: string): Promise<Market[] | Error> => {
  return marketAxios
    .get<Market[]>(
      '/market/active',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: formatMarketsByActiveStatus,
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки активных бирж'
      return new Error(error)
    })
}

const getMarket = async (id: string, token: string): Promise<Market | Error> => {
  return marketAxios
    .get(
      `/market/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки биржи'
      return new Error(error)
    })
}

// --- POST --- //
const createMarket = async (
  market: Market,
  token: string,
): Promise<Market | Error> => {
  return marketAxios
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

// --- PUT --- //
const updateMarket = async (
  id: string,
  market: Market,
  token: string,
): Promise<Market | Error> => {
  return marketAxios
    .put(
      `/market/update/${id}`,
      market,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
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
  return marketAxios
    .putNoRequestBody<Success>(
      `/market/${id}/${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { status } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка смены статуса биржи'
      return new Error(error)
    })
}

// --- DELETE --- //
const deleteMarket = async (id: string, token: string): Promise<Success | Error> => {
  return marketAxios
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

const MarketService = {
  getAllMarkets,
  getAllActiveMarkets,
  getMarket,

  createMarket,

  updateMarket,
  updateMarketStatus,

  deleteMarket,
}

export default MarketService
