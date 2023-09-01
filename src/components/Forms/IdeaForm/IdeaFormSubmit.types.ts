interface IdeaFormSubmitProps {
  isEditing: boolean
}

interface IdeaFormSubmitEmits {
  (event: 'on-submit'): void
  (event: 'on-update'): void
}

export { IdeaFormSubmitProps, IdeaFormSubmitEmits }
