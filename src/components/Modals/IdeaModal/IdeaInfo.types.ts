import ModeButtonsType from './modeButtons.types'

const modeButtons: ModeButtonsType[] = [
  {
    id: 1,
    text: 'Редактирования',
    iconClass: 'bi bi-pencil-square text-secondary fs-2 opacity-25',

    roles: ['INITIATOR'],
    status: ['NEW', 'ON_EDITING'],
  },
  {
    id: 2,
    text: 'Админ',
    iconClass: 'bi bi-exclamation-square text-secondary fs-2 opacity-25',

    roles: ['ADMIN'],
    status: ['NEW', 'ON_EDITING', 'ON_APPROVAL', 'ON_CONFIRMATION', 'CONFIRMED'],
  },
  {
    id: 3,
    text: 'Согласование идеи',
    iconClass: 'bi bi-check2-square text-secondary fs-2 opacity-25',

    roles: ['PROJECT_OFFICE'],
    status: ['ON_APPROVAL'],
  },
  {
    id: 4,
    text: 'Утверждение идеи',
    iconClass: 'bi bi-check2-square text-secondary fs-2 opacity-25',

    roles: ['EXPERT'],
    status: ['ON_CONFIRMATION'],
  },
]

export default modeButtons
