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
  stack?: Skill[]

  initiator: string
  projectOffice: UsersGroup[]
  experts: UsersGroup[]
  confirmedBy: string[]
  customer: string
  contactPerson: string

  preAssessment: number
  rating: number
  technicalRealizability: number
  suitability: number
  budget: number
  marketValue: number
  originality: number
}

interface Change {
  name: string
  date: Date
  who: string
  number: number
  doing: string
}

interface Risk {
  status: StatusTypes
  risk: number
  marketValue: string
  originality: string
  techniclFeasibility: string
  understanding: string
}

export { Idea, Risk, Change }
