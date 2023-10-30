import TeamMember from '@Domain/TeamMember'
import Profile from '@Domain/Profile'

interface TeamInvitation {
  id: number
  userEmail?: string //незарегистрированный пользователь
  user?: Profile //зарегистрированный пользователь
  teamId: string
  inviter: TeamMember
  createdAt: string
}

interface TeamInvitations {
  emails: string[]
}

export { TeamInvitation, TeamInvitations }
