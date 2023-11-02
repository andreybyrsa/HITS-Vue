import Team from '@Domain/Team'

interface TeamAccessionsModalEmits {
  (event: 'close-modal'): void
}

interface TeamAccessionsModalProps {
  isOpened: boolean
  team: Team
}

interface TeamAccessionsHeaderProps {
  team: Team
}

interface TeamAccessionsHeaderEmits {
  (event: 'closeTeamModal'): void
}

export {
  TeamAccessionsModalEmits,
  TeamAccessionsModalProps,
  TeamAccessionsHeaderProps,
  TeamAccessionsHeaderEmits,
}
