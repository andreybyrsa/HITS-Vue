import IdeaStatusTypes from '@Domain/IdeaStatus'
import UsersGroup from '@Domain/UsersGroup'
import { Skill } from '@Domain/Skill'
import TeamMember from '@Domain/TeamMember'

interface Idea {
  id: number
  initiator: TeamMember
  createdAt: string
  modifiedAt: string

  name: string
  problem: string
  description: string
  solution: string
  result: string
  status: IdeaStatusTypes
  maxTeamSize: number
  minTeamSize: number

  projectOffice: UsersGroup | null
  experts: UsersGroup | null
  customer: string
  contactPerson: string

  suitability: number
  budget: number
  preAssessment: number
  rating: number | null
}

interface Rating {
  id: number
  ideaId: number
  expertId: number

  marketValue: number | null
  originality: number | null
  technicalRealizability: number | null
  suitability: number | null
  budget: number | null
  rating: number | null
  confirmed: boolean
}

interface IdeaSkills {
  ideaId: number
  skills: Skill[]
}

export { Idea, Rating, IdeaSkills }
