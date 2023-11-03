import { Skill } from './Skill'
import IdeasMarketStatusTypes from './MarketStatus'

interface IdeasMarket {
  id: number
  position: number
  name: string
  initiator: string
  description: string
  stack: Skill[]
  createdAt: Date
  maxTeamSize: number
  status: IdeasMarketStatusTypes
  requests: number
  acceptedRequests: number
  isFavorite?: boolean
}

export default IdeasMarket
