import RolesTypes from '@Domain/Roles'
import IdeaStatusTypes from '@Domain/IdeaStatus'

interface IdeaActionsType {
  id: number
  text: string
  class: string
  to: string
  roles: RolesTypes[]
  status: IdeaStatusTypes[]
}

export default IdeaActionsType
