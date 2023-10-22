import { VueElement } from 'vue'

import { Idea, Rating } from '@Domain/Idea'

interface IdeaDescriptionProps {
  idea: Idea
}

interface IdeaActionsProps {
  idea?: Idea
}

interface IdeaCommentsProps {
  idea: Idea

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
  id: keyof Idea
  ideaKey: keyof Idea
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
