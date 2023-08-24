import IdeaActionsType from './IdeaActions.types'

const actionsButton: IdeaActionsType[] = [
  {
    id: 0,
    text: 'Отправить на согласование',
    to: '/ideas',
    class: 'btn-success',
    roles: ['INITIATOR'],
    status: ['NEW', 'ON_EDITING'],
  },
  {
    id: 1,
    text: 'Отправить на доработку',
    class: 'btn-danger',
    to: '/ideas',
    roles: ['PROJECT_OFFICE'],
    status: ['ON_APPROVAL'],
  },
  {
    id: 2,
    text: 'Отправить на утверждение',
    class: 'btn-primary',
    to: '/ideas',
    roles: ['PROJECT_OFFICE'],
    status: ['ON_APPROVAL'],
  },
  {
    id: 3,
    text: 'Отправить на доработку',
    class: 'btn-danger',
    to: '/ideas',
    roles: ['EXPERT'],
    status: ['ON_CONFIRMATION'],
  },
  {
    id: 4,
    text: 'Утвердить',
    class: 'btn-primary',
    to: '/ideas',
    roles: ['EXPERT'],
    status: ['ON_CONFIRMATION'],
  },
]

export default actionsButton
