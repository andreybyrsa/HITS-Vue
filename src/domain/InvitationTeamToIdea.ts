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
  ideaId: string
  initiatorId: string

  ideaName: string
  teamName: string

  status: InvitationTeamToIdeaStatus

  teamMembersCount: number
  skills: Skill[]
}

export { InvitationTeamToIdeaStatus, InvitationTeamToIdea }
