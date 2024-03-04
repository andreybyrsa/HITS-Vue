interface InvitationTeamMemberModalProps {
  isCreateTeam?: boolean
  isOpened: boolean
}

interface InvitationTeamMemberModalEmits {
  (event: 'close-modal'): void
}

export { InvitationTeamMemberModalProps, InvitationTeamMemberModalEmits }
