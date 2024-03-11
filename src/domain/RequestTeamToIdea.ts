import { Skill } from '@Domain'

export type RequestToIdeaStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'CANCELED'
  | 'ANNULLED'
  | 'WITHDRAWN'

export interface RequestTeamToIdea {
  ideaMarketId: string
  status: RequestToIdeaStatus
  letter: string
  teamId: string
  marketId: string

  id: string
  name: string
  membersCount: number
  skills: Skill[]
}
