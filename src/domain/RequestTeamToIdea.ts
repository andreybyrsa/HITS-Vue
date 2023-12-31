import { Skill } from '@Domain/Skill'

type RequestToIdeaStatus = 'NEW' | 'ACCEPTED' | 'CANCELED' | 'ANNULLED' | 'WITHDRAWN'

interface RequestTeamToIdea {
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

export { RequestTeamToIdea, RequestToIdeaStatus }
