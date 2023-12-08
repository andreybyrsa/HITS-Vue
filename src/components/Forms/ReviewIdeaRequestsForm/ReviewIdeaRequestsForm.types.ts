import IdeasMarket from '@Domain/IdeasMarket'
import { Team } from '@Domain/Team'
import { RequestTeams } from '@Domain/RequestTeams'

interface ReviewIdeaRequestsFormProps {
  idea: IdeasMarket
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
