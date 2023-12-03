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
  name: string
  createdAt: string
  description: string
  closed: boolean
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

interface TeamInvitation {
  id: string
  teamId: string
  userId: string
  email: string
  firstName: string
  lastName: string
}

type RequestToTeamStatus = 'NEW' | 'ACCEPTED' | 'CANCELED'

interface RequestToTeam {
  id: string
  teamId: string
  userId: string
  status: RequestToTeamStatus
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
}
