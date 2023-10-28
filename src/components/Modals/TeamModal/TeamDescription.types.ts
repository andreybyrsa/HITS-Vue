import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

interface TeamDescriptionProps {
  team: Team
}

interface TeamDescriptionEmit {
  (event: 'handleKick', member: TeamMember, teamId: number): void
  (event: 'closeModal'): void
}

export { TeamDescriptionProps, TeamDescriptionEmit }
