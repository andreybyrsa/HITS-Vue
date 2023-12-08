import { Skill } from '@Domain/Skill'

type RequestsToIdeaStatus = 'NEW' | 'ACCEPTED' | 'CANCELLED'

interface RequestTeams {
  ideaId: string
  status: RequestsToIdeaStatus
  letter: string
  teamId: string

  id: string
  name: string
  membersCount: number
  skills: Skill[]
}

export { RequestTeams, RequestsToIdeaStatus }
