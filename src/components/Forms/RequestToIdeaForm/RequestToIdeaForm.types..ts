import IdeasMarket from '@Domain/IdeasMarket'
import Team from '@Domain/Team'

interface RequestToIdeaProps {
  idea: IdeasMarket
  isDisabledButtonSkills?: boolean
}

interface RequestTeamCollapseProps {
  team: Team
  idea: IdeasMarket
  isDisabledButtonSkills?: boolean
}

export { RequestToIdeaProps, RequestTeamCollapseProps }
