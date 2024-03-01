import { Skill } from '@Domain'

export type InvitationTeamToIdeaStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'CANCELED'
  | 'ANNULLED'
  | 'WITHDRAWN'

export interface InvitationTeamToIdea {
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
