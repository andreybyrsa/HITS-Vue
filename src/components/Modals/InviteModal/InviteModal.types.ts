interface InviteModalProps {
  isOpened: boolean
}

interface InviteModalEmits {
  (event: 'close-modal'): void
  (event: 'invite', email: string): void
}

export { InviteModalProps, InviteModalEmits }
