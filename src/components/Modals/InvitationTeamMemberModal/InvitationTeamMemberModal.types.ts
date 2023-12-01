interface InvitationTeamMemberModalProps {
  isOpened: boolean
}

interface InvitationTeamMemberModalEmits {
  (event: 'close-modal'): void
}

export { InvitationTeamMemberModalProps, InvitationTeamMemberModalEmits }
