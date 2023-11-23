import IdeaStatusTypes from '@Domain/IdeaStatus'
import UsersGroup from '@Domain/UsersGroup'
import { Skill } from '@Domain/Skill'

interface Idea {
  id: string
  initiatorEmail: string
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

  checkedBy: string[]
}

interface Rating {
  id: string
  ideaId: string
  expertId: string

  marketValue: number | null
  originality: number | null
  technicalRealizability: number | null
  suitability: number | null
  budget: number | null
  rating: number | null
  confirmed: boolean
}

interface IdeaSkills {
  ideaId: string
  skills: Skill[]
}

export { Idea, Rating, IdeaSkills }
