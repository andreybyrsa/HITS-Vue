import { Skill } from './Skill'
import IdeasMarketStatusTypes from './MarketStatus'

interface IdeasMarket {
  id: string
  position: number
  name: string
  problem: string
  solution: string
  result: string
  customer: string
  initiator: string
  description: string
  stack: Skill[]
  createdAt: string
  maxTeamSize: number
  status: IdeasMarketStatusTypes
  requests: number
  acceptedRequests: number
  isFavorite?: boolean
}

export default IdeasMarket
