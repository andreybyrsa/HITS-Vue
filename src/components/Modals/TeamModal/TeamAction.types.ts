import Team from '@Domain/Team'

interface TeamActionProps {
  team?: Team
}

interface Project {
  id: string
  name: string
  description: string
}

interface TeamButtonAction {
  id: number
  name: string
  buttonClass: string
}

const teamButtons: TeamButtonAction[] = [
  {
    id: 0,
    name: 'Редактировать',
    buttonClass: 'bi bi-pencil-square btn-primary',
  },
  {
    id: 1,
    name: 'Пригласить в команду',
    buttonClass: 'bi bi-envelope-plus-fill btn-primary',
  },
  {
    id: 2,
    name: 'Подать заявку на вступление',
    buttonClass: 'bi bi-card-text btn-primary',
  },
  {
    id: 3,
    name: 'Раcсмотреть заявки',
    buttonClass: 'bi bi-card-checklist btn-primary',
  },
  {
    id: 4,
    name: 'Скопировать ссылку',
    buttonClass: 'bi bi-share-fill btn-primary',
  },
  {
    id: 5,
    name: 'Удалить команду',
    buttonClass: 'bi bi-trash3-fill btn-danger',
  },
  {
    id: 6,
    name: 'Подать заявку на выход',
    buttonClass: 'bi bi-box-arrow-left btn-danger',
  },
]

export { TeamButtonAction, TeamActionProps, teamButtons, Project }
