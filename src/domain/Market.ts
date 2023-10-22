interface Market {
  id: number
  position: string
  problem: string
  solution: string
  result: string
  name: string
  initiator: string
  description: string
  stack: string
  creationDate: string
  members: number
  customer: string
  teamSize: number
  status: string
  numberofRequests: number
  isFavorite?: boolean
}

export default Market
