import { VueElement } from 'vue'

import { Idea } from '@Domain/Idea'

interface IdeaModalProps {
  isOpened: boolean

  idea?: Idea
}

interface IdeaDescriptionProps {
  idea?: Idea
}

interface IdeaActionsProps {
  idea?: Idea
}

interface IdeaCommentsProps {
  idea?: Idea

  ideaModalRef: VueElement | null
}

interface IdeaInfoProps {
  idea?: Idea
}

interface IdeaModalEmits {
  (event: 'close-modal'): void
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
  IdeaModalProps,
  IdeaDescriptionProps,
  IdeaActionsProps,
  IdeaCommentsProps,
  IdeaInfoProps,
  IdeaModalEmits,
  IdeaDescriptionEmits,
  IdeaModalCollapseType,
}
