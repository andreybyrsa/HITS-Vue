import { User } from '@Domain/User'
import { TeamInvitation } from '@Domain/TeamInvitation'

type teamRequestType = 'leave' | 'enter'

interface TeamRequest {
  id: number
  teamId: string
  sender: User
  text: string
  type: teamRequestType
  createdAt: string
}

interface TeamRequestsAndInvitations {
  requests: TeamRequest[]
  invitations: TeamInvitation[]
  teamId: string
}

export { TeamRequest, TeamRequestsAndInvitations }
