import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Team, TeamInvitation, RequestToTeam } from '@Domain/Team'

interface TeamDescriptionProps {
  team: Team
}

interface TeamModalTables {
  team: Team
  invitations?: TeamInvitation[]
  requests?: RequestToTeam[]
  requestsTeamsToIdea?: RequestTeamToIdea[]
}

interface TeamMembersProps {
  team: Team
}

interface TeamInvitationsProps {
  invitations: TeamInvitation[]
  team: Team
}

interface RequestsToTeamProps {
  requests: RequestToTeam[]
  team: Team
}

interface RequestsTeamToIdeasProps {
  requests: RequestTeamToIdea[]
  team?: Team
}

interface TeamModalActionsProps {
  team: Team
}

interface TeamModalInfoProps {
  team: Team
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
  RequestsTeamToIdeasProps,
  TeamModalActionsProps,
  TeamModalInfoProps,
  TeamDescriptionEmits,
  TeamModalActionsEmits,
}
