export type MarketStatus = 'NEW' | 'ACTIVE' | 'DONE'

export interface Market {
  id: string
  name: string
  startDate: string
  finishDate: string
  status: MarketStatus
}
