import StatusTypes from '@Domain/IdeaStatus'
import UsersGroup from '@Domain/UsersGroup'
import { Skill } from '@Domain/Skill'

interface Idea {
  id: string
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
  projectOffice: UsersGroup[]
  experts: UsersGroup[]
  customer: string
  contactPerson: string

  technicalRealizability: number
  suitability: number
  budget: number
  preAssessment: number
  rating: number | null
}

interface Rating {
  id: string
  ideaId: string
  expert: string

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
