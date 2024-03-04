import { IdeaStatusType, RolesTypes } from '@Domain'
import { getIdeaStatus } from '@Utils'

const status = getIdeaStatus().status

interface ModeButtonsType {
  id: number
  text: string

  roles: RolesTypes[]
  status: IdeaStatusType[]
}

export const modeButtons: ModeButtonsType[] = [
  {
    id: 1,
    text: 'Админ',
    roles: ['ADMIN'],
    status: status,
  },
  {
    id: 2,
    text: 'Согласование идеи',
    roles: ['PROJECT_OFFICE'],
    status: ['ON_APPROVAL'],
  },
  {
    id: 3,
    text: 'Утверждение идеи',
    roles: ['EXPERT'],
    status: ['ON_CONFIRMATION'],
  },
]
