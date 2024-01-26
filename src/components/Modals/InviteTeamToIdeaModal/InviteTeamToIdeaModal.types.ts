type InviteOrRevoke = 'INVITE' | 'REVOKE'

interface InviteModalProps {
  isOpened: boolean
  teamName?: string
  ideaName?: string
  type: InviteOrRevoke
}

interface inviteModalEmits {
  (event: 'close-modal'): void
  (event: 'on-click'): void
}

export { InviteOrRevoke, InviteModalProps, inviteModalEmits }
