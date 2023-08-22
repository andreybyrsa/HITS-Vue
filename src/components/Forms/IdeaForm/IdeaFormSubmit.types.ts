interface IdeaFormSubmitProps {
  isEditing: boolean
}

interface IdeaFormSubmitEmits {
  (event: 'on-submit'): void
  (event: 'on-update'): void
  (event: 'on-delete'): void
}

export { IdeaFormSubmitProps, IdeaFormSubmitEmits }
