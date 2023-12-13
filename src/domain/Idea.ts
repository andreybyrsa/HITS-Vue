import UsersGroup from '@Domain/UsersGroup'
import { Skill } from '@Domain/Skill'

type IdeaStatusType =
  | 'NEW'
  | 'ON_EDITING'
  | 'ON_APPROVAL'
  | 'ON_CONFIRMATION'
  | 'CONFIRMED'
  | 'ON_MARKET'

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
  status: IdeaStatusType
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
  id: string
  ideaId: string
  expertId: string
  firstName: string
  lastName: string

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

export { Idea, IdeaStatusType, Rating, IdeaSkills }
