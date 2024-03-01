import { Market, MarketStatus } from '@Domain/Market'
import Success from '@Domain/ResponseMessage'
import { marketMocks } from '@Utils/getMocks'
import defineAxios from '@Utils/defineAxios'

const defineApi = defineAxios(marketMocks)

const formatMarketsByActiveStatus = (markets: Market[]) => {
  return markets.filter(({ status }) => status === 'ACTIVE')
}

const getAllMarkets = async (): Promise<Market[] | Error> => {
  const response = await defineApi.get('/market/all')
  return response.data
}

const getAllActiveMarkets = async (): Promise<Market[] | Error> => {
  const response = await defineApi.get<Market[]>(
    '/market/active',
    {},
    {
      formatter: formatMarketsByActiveStatus,
    },
  )
  return response.data
}

const getMarket = async (id: string): Promise<Market | Error> => {
  const response = await defineApi.get(`/market/${id}`, {}, { params: { id } })
  return response.data
}

const createMarket = async (market: Market): Promise<Market | Error> => {
  const response = await defineApi.post('/market/create', market)
  return response.data
}

const updateMarket = async (id: string, market: Market): Promise<Market | Error> => {
  const response = await defineApi.put(
    `/market/update/${id}`,
    market,
    {},
    { params: { id } },
  )
  return response.data
}

const updateMarketStatus = async (
  id: string,
  status: MarketStatus,
): Promise<Success | Error> => {
  const response = await defineApi.putNoRequestBody<Success>(
    `/market/status/${id}/${status}`,
    {},
    { params: { id }, requestData: { status } },
  )
  return response.data
}

const deleteMarket = async (id: string): Promise<Success | Error> => {
  const response = await defineApi.delete(
    `/market/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

export const MarketService = {
  getAllMarkets,
  getAllActiveMarkets,
  getMarket,
  createMarket,
  updateMarket,
  updateMarketStatus,
  deleteMarket,
}
