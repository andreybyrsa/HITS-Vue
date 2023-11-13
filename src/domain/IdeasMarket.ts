import { Skill } from './Skill'
import IdeasMarketStatusTypes from './MarketStatus'
import TeamMember from './TeamMember'

interface IdeasMarket {
  id: number
  position: number
  name: string
  problem: string
  solution: string
  result: string
  customer: string
  initiator: TeamMember
  description: string
  stack: Skill[]
  createdAt: string
  maxTeamSize: number
  status: IdeasMarketStatusTypes
  requests: number
  acceptedRequests: number
  isFavorite?: boolean

  startDate: string
  finishDate: string
}

export default IdeasMarket
