import { Skill } from '@Domain/Skill'

type InvitationTeamToIdeaStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'CANCELED'
  | 'ANNULLED'
  | 'WITHDRAWN'

interface InvitationTeamToIdea {
  ideaMarketId: string
  ideaMarketName: string
  initiatorId: string

  status: InvitationTeamToIdeaStatus
  teamId: string
  marketId: string

  id: string
  name: string
  membersCount: number
  skills: Skill[]
}

export { InvitationTeamToIdeaStatus, InvitationTeamToIdea }
