import { User } from '@Domain/User'
import { TeamInvitation } from './TeamInvitation'

interface TeamRequest {
  id: number
  teamId: string
  sender: User
  text: string
  type: 'leave' | 'enter'
  requestDate: string
  responedBy?: string
  resposneDate?: string
  isApproved?: boolean
}

interface TeamRequestsAndInvitations {
  requests: TeamRequest[]
  invitations: TeamInvitation[]
  teamId: string
}

export { TeamRequest, TeamRequestsAndInvitations }
