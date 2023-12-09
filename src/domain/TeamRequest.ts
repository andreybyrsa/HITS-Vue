interface TeamRequest {
  id: string
  teamId: string
  userId: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  status: 'NEW' | 'ACCEPTED' | 'CANCELED'
}

export default TeamRequest
