import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

interface TeamStuffProps {
  team: Team
}

interface TeamDescriptionProps {
  team: Team
}

interface TeamDescriptionEmits {
  (event: 'handleKick', member: TeamMember, teamId: number): void
  (event: 'closeModal'): void
}

export { TeamStuffProps, TeamDescriptionProps, TeamDescriptionEmits }
