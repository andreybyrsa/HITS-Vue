import Market from '@Domain/Market'
import Team from '@Domain/Team'

interface RequestToIdeaProps {
  teams: Team[]
  idea: Market
}

interface RequestTeamProps {
  teams: Team[]
}

export { RequestToIdeaProps, RequestTeamProps }
