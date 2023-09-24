interface AddSkillModalProps {
  isOpened: boolean
  status: 'EDIT' | 'ADD'
}

interface AddSkillModalEmits {
  (event: 'close-modal'): void
}

export { AddSkillModalProps, AddSkillModalEmits }
