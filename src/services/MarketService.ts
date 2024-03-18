import { Market, MarketStatus } from '@Domain/Market'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { marketMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const marketAxios = defineAxios(marketMocks)

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
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки бирж'))
}

const getAllActiveMarkets = async (token: string): Promise<Market[] | Error> => {
  return marketAxios
    .get<Market[]>(
      '/ideas-service/market/active',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: formatMarketsByActiveStatus,
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки активных бирж'))
}

const getMarket = async (id: string, token: string): Promise<Market | Error> => {
  return marketAxios
    .get(
      `/ideas-service/market/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки биржи'))
}

// --- POST --- //
const createMarket = async (
  market: Market,
  token: string,
): Promise<Market | Error> => {
  return marketAxios
    .post('/ideas-service/market/create', market, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания биржи'))
}

// --- PUT --- //
const updateMarket = async (
  id: string,
  market: Market,
  token: string,
): Promise<Market | Error> => {
  return marketAxios
    .put(
      `/ideas-service/market/update/${id}`,
      market,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования биржи'))
}

const updateMarketStatus = async (
  id: string,
  status: MarketStatus,
  token: string,
): Promise<Success | Error> => {
  return marketAxios
    .putNoRequestBody<Success>(
      `/ideas-service/market/status/${id}/${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { status } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка смены статуса биржи'))
}

// --- DELETE --- //
const deleteMarket = async (id: string, token: string): Promise<Success | Error> => {
  return marketAxios
    .delete(
      `/ideas-service/market/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления биржи'))
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
