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
  (event: 'openModal', id: number, modalName: string): void
}

const modalNames = {
  deleteModal: 'deleteModal',
  inviteModal: 'inviteModal',
  accessionModal: 'requestModal',
  teamAccessionsModal: 'teamAccessionsModal',
}

export {
  TeamActionProps,
  Project,
  TeamActionButtonsProps,
  TeamActionButtonsEmits,
  modalNames,
}
