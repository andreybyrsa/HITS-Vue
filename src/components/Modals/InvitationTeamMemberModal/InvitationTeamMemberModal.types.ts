export interface InvitationTeamMemberModalProps {
  isCreateTeam?: boolean
  isOpened: boolean
}

export interface InvitationTeamMemberModalEmits {
  (event: 'close-modal'): void
}
