import { Idea } from '@Domain/Idea'

interface IdeaFormSubmitProps {
  idea: Idea
}

interface IdeaFormSubmitEmits {
  (event: 'on-send-on-approval'): void
  (event: 'on-save-draft'): void
}

export { IdeaFormSubmitProps, IdeaFormSubmitEmits }
