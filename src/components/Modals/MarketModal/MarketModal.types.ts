import { VueElement } from 'vue'

import { IdeaMarket } from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'
import { Market } from '@Domain/Market'

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
  market: Market
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
  key: keyof IdeaMarket | keyof Market
  name: string
  icon: string
}

interface MarketAdvertisementsProps {
  ideaMarket: IdeaMarket

  ideaMarketModalRef: VueElement | null
}

interface MarketRightSideProps {
  market: Market
  idea: IdeaMarket
  skills: Skill[]
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
  MarketAdvertisementsProps,
  MarketInfoProps,
  MarketModalCollapseType,
  MarketModalTabType,
  MarketSkillsradarChartsProps,
  MarketRightSideProps,
  MarketModalEmits,
}
