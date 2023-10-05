import Team from '@Domain/Team'

interface TeamModalProps {
  isOpened: boolean

  team?: Team
}

interface TeamModalEmits {
  (event: 'close-modal'): void
}

export { TeamModalProps, TeamModalEmits }
