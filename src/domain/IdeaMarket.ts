import { Skill } from '@Domain/Skill'
import IdeasMarketStatusTypes from '@Domain/MarketStatus'
import TeamMember from '@Domain/TeamMember'

interface IdeaMarket {
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

export default IdeaMarket
