import Team from '@Domain/Team'

interface RequestsAndInvitationsEmits {
  (event: 'close-modal'): void
}

interface RequestsAndInvitationsProps {
  isOpened: boolean
  team: Team
}

export { RequestsAndInvitationsEmits, RequestsAndInvitationsProps }
