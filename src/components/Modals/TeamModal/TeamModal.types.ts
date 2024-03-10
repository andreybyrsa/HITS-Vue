import {
  IdeaMarket,
  InvitationTeamToIdea,
  RequestTeamToIdea,
  Team,
  TeamInvitation,
  RequestToTeam,
} from '@Domain'

export interface TeamDescriptionProps {
  team: Team
}

export interface TeamModalTables {
  team: Team
  invitations?: TeamInvitation[]
  requests?: RequestToTeam[]
  requestsTeamsToIdea?: RequestTeamToIdea[]
  invitationsForTeam?: InvitationTeamToIdea[]
}

export interface TeamMembersProps {
  team: Team
}

export interface TeamInvitationsProps {
  invitations: TeamInvitation[]
  team: Team
}

export interface RequestsToTeamProps {
  requests: RequestToTeam[]
  team: Team
}

export interface RequestsTeamToIdeasProps {
  requests: RequestTeamToIdea[]
  team?: Team
}

export interface TeamModalActionsProps {
  ideasInitiator: IdeaMarket[]
  team: Team
}

export interface TeamModalInfoProps {
  team: Team
}

export interface TeamDescriptionEmits {
  (event: 'close-modal'): void
}

export interface TeamModalActionsEmits {
  (event: 'close-modal'): void
}

export interface InvitationsToIdeaForTeamTableProps {
  invitations: InvitationTeamToIdea[]
  team: Team
}
