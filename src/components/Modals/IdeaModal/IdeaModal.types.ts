import { VueElement } from 'vue'

import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import IdeasMarket from '@Domain/IdeasMarket'

interface IdeaDescriptionProps {
  idea: Idea
  ideaSkills?: IdeaSkills
}

interface IdeaActionsProps {
  idea: Idea
}

interface IdeaCommentsProps {
  idea: Idea | IdeasMarket
  news?: boolean

  ideaModalRef: VueElement | null
}

interface IdeaInfoProps {
  idea: Idea
  expertRatings?: Rating[]
}

interface IdeaDescriptionEmits {
  (event: 'close-modal'): void
}

interface IdeaModalCollapseType {
  key: number
  id: number
  ideaKey: keyof Idea | keyof IdeasMarket
  text: string
}

export {
  IdeaDescriptionProps,
  IdeaActionsProps,
  IdeaCommentsProps,
  IdeaInfoProps,
  IdeaDescriptionEmits,
  IdeaModalCollapseType,
}
