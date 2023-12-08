import IdeaMarket from '@Domain/IdeaMarket'
import RequestTeamToIdea from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

interface RequestToIdeaFormProps {
  idea: IdeaMarket
  requests: RequestTeamToIdea[]
  ownerTeams: Team[]
}

interface RequestTeamCollapseProps {
  team: Team
  idea: IdeaMarket
  isDisabledButtonSkills?: boolean
}

export { RequestToIdeaFormProps, RequestTeamCollapseProps }
