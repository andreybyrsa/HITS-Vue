import { EditUserInputType } from '@Components/Modals/EditUserModal/EditUserModal.types'

const editUserInputs: EditUserInputType[] = [
  {
    id: 0,
    type: 'email',
    name: 'newEmail',
    placeholder: 'Введите email',
    prepend: '@',
  },
  {
    id: 1,
    name: 'newFirstName',
    placeholder: 'Введите имя',
    prependIconName: 'bi bi-fonts',
  },
  {
    id: 2,
    name: 'newLastName',
    placeholder: 'Введите фамилию',
    prependIconName: 'bi bi-fonts',
  },
]

export default editUserInputs
