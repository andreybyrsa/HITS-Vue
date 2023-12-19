import { IdeaMarket } from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'

interface RequestsToIdeaTableProps {
  ideaMarket: IdeaMarket
  requests: RequestTeamToIdea[]
}

export default RequestsToIdeaTableProps
