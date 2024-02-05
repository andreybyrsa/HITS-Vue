import { Skill } from '@Domain/Skill'

type InvitationTeamToIdeaStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'CANCELED'
  | 'ANNULLED'
  | 'WITHDRAWN'

interface InvitationTeamToIdea {
  id: string
  teamId: string
  ideaMarketId: string
  initiatorId: string

  ideaMarketName: string
  teamName: string

  status: InvitationTeamToIdeaStatus

  membersCount: number
  skills: Skill[]
}

export { InvitationTeamToIdeaStatus, InvitationTeamToIdea }
