import { VueElement } from 'vue'
import { Idea, IdeaSkills, Rating } from '@Domain'

export interface IdeaModalProps {
  canGoBack?: boolean
}

export interface IdeaDescriptionProps {
  idea: Idea
  ideaSkills?: IdeaSkills
}

export interface IdeaActionsProps {
  idea: Idea
}

export interface IdeaCommentsProps {
  idea: Idea

  ideaModalRef: VueElement | null
}

export interface IdeaInfoProps {
  idea: Idea
  expertRatings?: Rating[]
}

export interface IdeaDescriptionEmits {
  (event: 'close-modal'): void
}

export interface IdeaModalCollapseType {
  key: string
  id: string
  ideaKey: keyof Idea
  text: string
}
