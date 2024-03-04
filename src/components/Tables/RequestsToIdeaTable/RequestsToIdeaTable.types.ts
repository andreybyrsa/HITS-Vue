import { IdeaMarket } from '@Domain'
import { RequestTeamToIdea } from '@Domain'

export interface RequestsToIdeaTableProps {
  ideaMarket: IdeaMarket
  requests: RequestTeamToIdea[]
}
