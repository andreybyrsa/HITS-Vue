import IdeaMarket from '@Domain/IdeaMarket'
import { Team } from '@Domain/Team'

interface RequestToIdeaFormProps {
  idea: IdeaMarket
}

interface RequestTeamCollapseProps {
  team: Team
  idea: IdeaMarket
  isDisabledButtonSkills?: boolean
}

export { RequestToIdeaFormProps, RequestTeamCollapseProps }
