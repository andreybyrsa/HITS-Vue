import { User } from '@Domain/User'
import { Team } from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import IdeasMarketStatusTypes from '@Domain/MarketStatus'

interface IdeaMarket {
  id: string
  initiator: User
  createdAt: string
  name: string
  problem: string
  description: string
  solution: string
  result: string
  maxTeamSize: number
  customer: string

  position: number
  team: Team | null
  stack: Skill[]
  status: IdeasMarketStatusTypes
  requests: number
  acceptedRequests: number
  startDate: string
  finishDate: string
  isFavorite: boolean
}

export default IdeaMarket
