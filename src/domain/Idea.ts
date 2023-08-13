interface Idea {
  id?: number
  initiator?: string
  name: string
  dateCreated: Date
  dateUpdated: Date
  projectType?: 'inside' | 'outside'
  experts?: string[]
  problem?: string
  solution?: string
  result?: string
  customer?: string
  description?: string
  realizability?: string
  suitability?: string
  budget?: string
  status: 'ON_EDITING' | 'ON_APPROVAL' | 'ON_CONFIRMATION' | 'CONFIRMED'
  rating: number
  risk: number
}

interface Risk {
  status: 'ON_EDITING' | 'ON_APPROVAL' | 'ON_CONFIRMATION' | 'CONFIRMED'
  risk: number
  price: string
  originality: string
  techniclFeasibility: string
  understanding: string
}

export { Idea, Risk }
