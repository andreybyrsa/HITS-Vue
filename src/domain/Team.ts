import { Skill } from '@Domain/Skill'
import { Project } from '@Domain/Project'

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

  hasActiveProject: boolean
}

interface TeamSkills {
  teamId: string
  skills: Skill[]
  wantedSkills: Skill[]
}

interface TeamExperience {
  teamId: string
  teamName: string
  userId: string
  firstName: string
  lastName: string
  startDate: string
  finishDate: string | null
  hasActiveProject: boolean
}

interface TeamProject {
  teamId: string
  teamName: string
  project: Project
}

type JoinStatus = 'NEW' | 'ANNULLED' | 'ACCEPTED' | 'CANCELED' | 'WITHDRAWN'

interface RequestToTeam {
  id: string
  teamId: string
  userId: string
  status: JoinStatus
  email: string
  firstName: string
  lastName: string
}

interface TeamInvitation {
  id: string
  teamId: string
  userId: string
  status: JoinStatus
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
  JoinStatus,
  TeamExperience,
  TeamProject,
}
