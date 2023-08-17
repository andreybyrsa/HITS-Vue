import { Idea } from '@Domain/Idea'

interface IdeaModalProps {
  isOpened: boolean

  idea?: Idea
}

interface IdeaModalEmits {
  (event: 'close-modal'): void
}

interface IdeaModalCollapseType {
  key: number
  id: keyof Idea
  ideaKey: keyof Idea
  text: string
}

export { IdeaModalProps, IdeaModalEmits, IdeaModalCollapseType }
