import Market from '@Domain/Market'
import Team from '@Domain/Team'

interface RequestToIdeaProps {
  idea: Market
}

interface RequestTeamCollapseProps {
  team: Team
}

export { RequestToIdeaProps, RequestTeamCollapseProps }
