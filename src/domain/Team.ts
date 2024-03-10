import { Skill, Project } from '@Domain'

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  email: string
  firstName: string
  lastName: string
  skills: Skill[]
}

export interface Team {
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

export interface TeamSkills {
  teamId: string
  skills: Skill[]
  wantedSkills: Skill[]
}

export interface TeamExperience {
  teamId: string
  teamName: string
  userId: string
  firstName: string
  lastName: string
  startDate: string
  finishDate: string | null
  hasActiveProject: boolean
}

export interface TeamProject {
  teamId: string
  teamName: string
  project: Project
}

export type JoinStatus = 'NEW' | 'ANNULLED' | 'ACCEPTED' | 'CANCELED' | 'WITHDRAWN'

export interface RequestToTeam {
  id: string
  teamId: string
  userId: string
  status: JoinStatus
  email: string
  firstName: string
  lastName: string
}

export interface TeamInvitation {
  id: string
  teamId: string
  userId: string
  status: JoinStatus
  email: string
  firstName: string
  lastName: string
}
