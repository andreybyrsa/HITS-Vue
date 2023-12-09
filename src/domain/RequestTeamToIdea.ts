import { Skill } from '@Domain/Skill'

type RequestToIdeaStatus = 'NEW' | 'ACCEPTED' | 'CANCELED'

interface RequestTeamToIdea {
  ideaMarketId: string
  status: RequestToIdeaStatus
  letter: string
  teamId: string

  id: string
  name: string
  membersCount: number
  skills: Skill[]
}

export { RequestTeamToIdea, RequestToIdeaStatus }
