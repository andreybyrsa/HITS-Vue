type MarketStatus = 'NEW' | 'ACTIVE' | 'DONE'
interface Market {
  id: string
  name: string
  startDate: string
  finishDate: string
  status: MarketStatus
}
export { Market, MarketStatus }
