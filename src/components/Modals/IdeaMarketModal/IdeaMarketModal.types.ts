import { VueElement } from 'vue'

import { IdeaMarket } from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'

interface IdeaMarketModalProps {
  isOpened: boolean
}

interface IdeaMarketDescriptionProps {
  ideaMarket: IdeaMarket
}

interface IdeaMarketTablesProps {
  ideaMarket: IdeaMarket
  requestTeams?: RequestTeamToIdea[]
}

interface IdeaMarketInfoProps {
  ideaMarket: IdeaMarket
}

interface IdeaMarketCollapseType {
  key: number
  id: number
  ideaKey: keyof IdeaMarket
  text: string
}

interface IdeaMarketTabType {
  id: string
  key: keyof IdeaMarket
  name: string
  icon: string
}

interface IdeaMarketAdvertsProps {
  ideaMarket: IdeaMarket

  ideaMarketModalRef: VueElement | null
}

interface IdeaMarketRightSideProps {
  idea: IdeaMarket
  skills: Skill[]
  skillsTeam?: Skill[]
}

interface IdeaMarketSkillsProps {
  skills: Skill[]
  skillsTeam?: Skill[]
  idea: IdeaMarket
}

interface IdeaMarketModalEmits {
  (event: 'close-modal'): void
}

export {
  IdeaMarketModalProps,
  IdeaMarketDescriptionProps,
  IdeaMarketTablesProps,
  IdeaMarketAdvertsProps,
  IdeaMarketInfoProps,
  IdeaMarketCollapseType,
  IdeaMarketTabType,
  IdeaMarketSkillsProps,
  IdeaMarketRightSideProps,
  IdeaMarketModalEmits,
}
