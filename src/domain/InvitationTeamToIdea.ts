import { Skill } from '@Domain/Skill'

type InvitationTeamToIdeaStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'CANCELED'
  | 'ANNULLED'
  | 'WITHDRAWN'

interface InvitationTeamToIdea {
  ideaMarketId: string
  status: InvitationTeamToIdeaStatus
  teamId: string
  // marketId: string

  id?: string
  name: string // название команды
  membersCount: number
  skills: Skill[]
}

export { InvitationTeamToIdeaStatus, InvitationTeamToIdea }
