import StatusTypes from '@Domain/IdeaStatus'
import UsersGroup from '@Domain/UsersGroup'
import { Skill } from '@Domain/Skill'

interface Idea {
  id: number
  createdAt: Date
  modifiedAt: Date
  name: string
  problem: string
  description: string
  solution: string
  result: string
  projectType: 'INSIDE' | 'OUTSIDE'
  status: StatusTypes
  initiator: string
  projectOffice: UsersGroup | null
  experts: UsersGroup | null
  customer: string
  contactPerson: string

  technicalRealizability: number
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
