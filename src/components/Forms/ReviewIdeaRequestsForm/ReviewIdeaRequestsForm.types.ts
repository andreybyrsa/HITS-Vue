import { Team } from '@Domain/Team'
import { RequestTeams } from '@Domain/RequestTeamToIdea'
import IdeaMarket from '@Domain/IdeaMarket'

interface ReviewIdeaRequestsFormProps {
  idea: IdeaMarket
}

interface IdeasModalTables {
  team: Team
  invitations?: RequestTeams[]
  requests?: RequestTeams[]
}

interface ReviewIdeaRequestTableProps {
  teams: RequestTeams[]
}

interface RequestsToIdeaProps {
  requests: RequestTeams[]
  team: Team
}

export {
  ReviewIdeaRequestsFormProps,
  IdeasModalTables,
  ReviewIdeaRequestTableProps,
  RequestsToIdeaProps,
}
