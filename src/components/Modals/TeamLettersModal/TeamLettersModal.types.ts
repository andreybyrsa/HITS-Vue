import Team from '@Domain/Team'

interface TeamLettersModalEmits {
  (event: 'close-modal'): void
}

interface TeamLettersModalProps {
  isOpened: boolean
  team: Team
}

export { TeamLettersModalEmits, TeamLettersModalProps }
