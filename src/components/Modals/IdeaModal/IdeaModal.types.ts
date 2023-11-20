import { VueElement } from 'vue'

import { Idea, IdeaSkills, Rating } from '@Domain/Idea'

interface IdeaDescriptionProps {
  idea: Idea
  ideaSkills?: IdeaSkills
}

interface IdeaActionsProps {
  idea: Idea
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
  key: string
  id: string
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
