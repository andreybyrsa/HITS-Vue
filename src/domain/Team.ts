import { Skill } from '@Domain/Skill'

interface TeamMember {
  id: string
  teamId: string
  userId: string
  email: string
  firstName: string
  lastName: string
  skills: Skill[]
}

interface Team {
  id: string
  createdAt: string

  name: string
  description: string
  closed: boolean
  isRefused: boolean
  membersCount: number
  owner: TeamMember
  leader?: TeamMember

  members: TeamMember[]
  skills: Skill[]
  wantedSkills: Skill[]
}

interface TeamSkills {
  teamId: string
  skills: Skill[]
  wantedSkills: Skill[]
}

type RequestToTeamStatus = 'NEW' | 'ANNULLED' | 'ACCEPTED' | 'CANCELED' | 'WITHDRAWN'
type InvitationToTeamStatus =
  | 'NEW'
  | 'ANNULLED'
  | 'ACCEPTED'
  | 'CANCELED'
  | 'WITHDRAWN'

interface RequestToTeam {
  id: string
  teamId: string
  userId: string
  status: RequestToTeamStatus
  email: string
  firstName: string
  lastName: string
}

interface TeamInvitation {
  id: string
  teamId: string
  userId: string
  status: InvitationToTeamStatus
  email: string
  firstName: string
  lastName: string
}

export {
  Team,
  TeamMember,
  TeamSkills,
  TeamInvitation,
  RequestToTeam,
  RequestToTeamStatus,
  InvitationToTeamStatus,
}
