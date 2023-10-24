import { EditUserInputType } from '@Components/Modals/EditUserModal/EditUserModal.types'

const editUserInputs: EditUserInputType[] = [
  {
    id: 0,
    type: 'email',
    name: 'email',
    placeholder: 'Введите email',
    prepend: '@',
  },
  {
    id: 1,
    name: 'firstName',
    placeholder: 'Введите имя',
    prependIconName: 'bi bi-fonts',
  },
  {
    id: 2,
    name: 'lastName',
    placeholder: 'Введите фамилию',
    prependIconName: 'bi bi-fonts',
  },
]

export default editUserInputs
