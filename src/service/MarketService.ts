import { Market, MarketStatus, Success } from '@Domain'
import { TryCatch, defineAxios, marketMocks } from '@Utils'

const defineApi = defineAxios(marketMocks)

const formatMarketsByActiveStatus = (markets: Market[]) => {
  return markets.filter(({ status }) => status === 'ACTIVE')
}

export class MarketService {
  @TryCatch
  static async getAllMarkets(): Promise<Market[] | Error> {
    const response = await defineApi.get('/market/all')
    return response.data
  }

  @TryCatch
  static async getAllActiveMarkets(): Promise<Market[] | Error> {
    const response = await defineApi.get<Market[]>(
      '/market/active',
      {},
      {
        formatter: formatMarketsByActiveStatus,
      },
    )
    return response.data
  }

  @TryCatch
  static async getMarket(id: string): Promise<Market | Error> {
    const response = await defineApi.get(`/market/${id}`, {}, { params: { id } })
    return response.data
  }

  @TryCatch
  static async createMarket(market: Market): Promise<Market | Error> {
    const response = await defineApi.post('/market/create', market)
    return response.data
  }

  @TryCatch
  static async updateMarket(id: string, market: Market): Promise<Market | Error> {
    const response = await defineApi.put(
      `/market/update/${id}`,
      market,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async updateMarketStatus(
    id: string,
    status: MarketStatus,
  ): Promise<Success | Error> {
    const response = await defineApi.putNoRequestBody<Success>(
      `/market/status/${id}/${status}`,
      {},
      { params: { id }, requestData: { status } },
    )
    return response.data
  }

  @TryCatch
  static async deleteMarket(id: string): Promise<Success | Error> {
    const response = await defineApi.delete(
      `/market/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
