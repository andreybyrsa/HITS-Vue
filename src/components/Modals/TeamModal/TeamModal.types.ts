import { Team, TeamInvitation, RequestToTeam, TeamSkills } from '@Domain/Team'

interface TeamDescriptionProps {
  team: Team
}

interface TeamModalTables {
  team: Team
  invitations?: TeamInvitation[]
  requests?: RequestToTeam[]
}

interface TeamMembersProps {
  team: Team
}

interface TeamInvitationsProps {
  invitations: TeamInvitation[]
}

interface RequestsToTeamProps {
  requests: RequestToTeam[]
  team: Team
}

interface TeamModalActionsProps {
  team: Team
}

interface TeamModalInfoProps {
  team: Team
  teamSkills?: TeamSkills
}

interface TeamDescriptionEmits {
  (event: 'close-modal'): void
}

interface TeamModalActionsEmits {
  (event: 'close-modal'): void
}

export {
  TeamDescriptionProps,
  TeamModalTables,
  TeamMembersProps,
  TeamInvitationsProps,
  RequestsToTeamProps,
  TeamModalActionsProps,
  TeamModalInfoProps,
  TeamDescriptionEmits,
  TeamModalActionsEmits,
}
