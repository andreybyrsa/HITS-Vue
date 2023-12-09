import { Skill } from '@Domain/Skill'

interface RequestTeamToIdea {
  ideaMarketId: string
  status: 'NEW' | 'ACCEPTED' | 'CANCELED'
  letter: string
  teamId: string

  id: string
  name: string
  membersCount: number
  skills: Skill[]
}

export default RequestTeamToIdea
