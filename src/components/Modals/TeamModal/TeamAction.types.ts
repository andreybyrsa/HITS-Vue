import Team from '@Domain/Team'

interface TeamActionProps {
  team?: Team
}

interface Project {
  id: string
  name: string
  description: string
}

interface TeamActionButtonsProps {
  team: Team
}

interface TeamActionButtonsEmits {
  (event: 'handleOpenModal', id: number, modalName: string): void
}

const modalNames = {
  deleteModal: 'deleteModal',
  inviteModal: 'inviteModal',
  requestModal: 'requestModal',
  requestsAndInvitationsModal: 'requestsAndInvitationsListModal',
}

export {
  TeamActionProps,
  Project,
  TeamActionButtonsProps,
  TeamActionButtonsEmits,
  modalNames,
}
