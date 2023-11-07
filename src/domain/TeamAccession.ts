import TeamMember from '@Domain/TeamMember'
import Team from '@Domain/Team'

type accessionStage = 'INVITATION' | 'REQUEST' | 'ACCEPTED' | 'REJECTED'
type requestType = 'ENTER' | 'LEAVE'

interface TeamAccession {
  id: number
  team: Team
  targetEmail: string

  targetRegistered: boolean
  stage: accessionStage
  text?: string
  requestType?: requestType

  inviter?: TeamMember
  updatedAt: string
}

interface InvitedUsers {
  emails: string[]
}

export { TeamAccession, accessionStage, requestType, InvitedUsers }
