import RolesTypes from '@Domain/Roles'
import IdeaStatusTypes from '@Domain/IdeaStatus'

interface ModeButtonsType {
  id: number
  text: string
  iconClass: string

  roles: RolesTypes[]
  status: IdeaStatusTypes[]
}

export default ModeButtonsType
