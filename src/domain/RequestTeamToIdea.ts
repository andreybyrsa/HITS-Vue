import { Skill } from '@Domain/Skill'

type RequestToIdeaStatus = 'NEW' | 'ACCEPTED' | 'CANCELLED'

interface RequestTeamToIdea {
  id: string
  ideaMarketId: string
  teamId: string

  name: string
  status: RequestToIdeaStatus
  letter: string
  membersCount: number
  skills: Skill[]
}

export { RequestTeamToIdea, RequestToIdeaStatus }
