import { Skill } from './Skill'
import IdeasMarketStatusTypes from './MarketStatus'
import TeamMember from './TeamMember'

interface IdeasMarket {
  id: string
  initiator: TeamMember
  createdAt: string
  name: string
  problem: string
  description: string
  solution: string
  result: string
  maxTeamSize: number
  customer: string

  position: number
  stack: Skill[]
  status: IdeasMarketStatusTypes
  requests: number
  acceptedRequests: number
  isFavorite: boolean
  startDate: string
  finishDate: string
}

export default IdeasMarket
