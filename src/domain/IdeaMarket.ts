import { User } from '@Domain/User'
import { Team } from '@Domain/Team'
import { Skill } from '@Domain/Skill'

type IdeaMarketStatusType =
  | 'RECRUITMENT_IS_OPEN'
  | 'RECRUITMENT_IS_CLOSED'
  | 'PROJECT'

interface IdeaMarket {
  id: string
  marketId: string
  ideaId: string
  initiator: User
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
  status: IdeaMarketStatusType
  requests: number
  acceptedRequests: number
  isFavorite: boolean
}

interface IdeaMarketAdvertisement {
  id: string
  ideaMarketId: string
  createdAt: string

  text: string
  sender: User
  checkedBy: string[]
}

export { IdeaMarket, IdeaMarketStatusType, IdeaMarketAdvertisement }
