import { VueElement } from 'vue'

import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Market from '@Domain/Market'

interface IdeaDescriptionProps {
  idea: Idea
  ideaSkills?: IdeaSkills
}

interface IdeaActionsProps {
  idea: Idea
}

interface IdeaCommentsProps {
  idea: Idea | Market

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
  ideaKey: keyof Idea | keyof Market
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
