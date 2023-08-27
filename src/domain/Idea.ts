import StatusTypes from '@Domain/IdeaStatus'
import Comment from '@Domain/Comment'

interface Idea {
  id: number
  initiator: string
  name: string
  dateCreated: Date
  dateModified: Date
  projectType: 'INSIDE' | 'OUTSIDE'
  experts?: string[]
  problem: string
  solution: string
  result: string
  customer: string
  contactPerson: string
  description: string
  realizability: number
  suitability: number
  budget: number
  status: StatusTypes
  rating: number
  risk: number
  comments: Comment[]
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
  price: string
  originality: string
  techniclFeasibility: string
  understanding: string
}

export { Idea, Risk, Change }
