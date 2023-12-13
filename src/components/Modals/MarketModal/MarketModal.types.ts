import { IdeaMarket } from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  ideaMarket: IdeaMarket
}

interface MarketTablesProps {
  ideaMarket: IdeaMarket
  requestTeams?: RequestTeamToIdea[]
}

interface MarketInfoProps {
  ideaMarket: IdeaMarket
}

interface MarketModalCollapseType {
  key: number
  id: number
  ideaKey: keyof IdeaMarket
  text: string
}

interface MarketModalTabType {
  id: string
  key: keyof IdeaMarket
  name: string
  icon: string
}

interface MarketRightSideProps {
  idea: IdeaMarket
  skills: Skill[]
  skillsTeam?: Skill[]
}

interface MarketSkillsradarChartsProps {
  skills: Skill[]
  skillsTeam?: Skill[]
  idea: IdeaMarket
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

export {
  MarketModalProps,
  MarketDescriptionProps,
  MarketTablesProps,
  MarketInfoProps,
  MarketModalCollapseType,
  MarketModalTabType,
  MarketSkillsradarChartsProps,
  MarketRightSideProps,
  MarketModalEmits,
}
