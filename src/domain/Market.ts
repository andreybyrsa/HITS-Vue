interface Market {
  id: string
  position: string
  name: string
  initiator: string
  description: string
  stack: string
  creationDate: Date
  members: number
  teamSize: number
  status: string
  numberofRequests: number
  isFavorite?: boolean
}

export default Market
