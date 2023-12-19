import RolesTypes from '@Domain/Roles'
import { IdeaStatusType } from '@Domain/Idea'

import { getIdeaStatus } from '@Utils/ideaStatus'

const status = getIdeaStatus().status

interface ModeButtonsType {
  id: number
  text: string

  roles: RolesTypes[]
  status: IdeaStatusType[]
}

const modeButtons: ModeButtonsType[] = [
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

export default modeButtons
