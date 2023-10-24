import { User } from '@Domain/User'

interface TeamInvitation {
  id: number
  userEmail?: string
  user?: User
  teamId: string
  inviter: User
  createdAt: Date
}

interface TeamUnregisteredInvitations {
  emails: string[]
}
interface TeamRegisteredInvitations {
  users: string[]
}
export { TeamInvitation, TeamUnregisteredInvitations, TeamRegisteredInvitations }
