import IdeasMarket from '@Domain/IdeasMarket'
import Team from '@Domain/Team'

interface RequestToIdeaProps {
  idea: IdeasMarket
}

interface RequestTeamCollapseProps {
  team: Team
}

export { RequestToIdeaProps, RequestTeamCollapseProps }
