import TeamMember from '@Domain/TeamMember'

type targetUserType = 'REGISTERED' | 'UNREGISTERED'
type accessionStage = 'INVITATION' | 'REQUEST' | 'ACCEPTED' | 'REJECTED'
type requestType = 'ENTER' | 'LEAVE'

interface TeamAccession {
  id: number
  teamId: number
  targetEmail: string

  targetUserType: targetUserType
  stage: accessionStage
  text?: string
  requestType?: requestType

  inviter?: TeamMember
  updatedAt: string
}

interface InvitedUsers {
  emails: string[]
}

export { TeamAccession, accessionStage, targetUserType, requestType, InvitedUsers }
