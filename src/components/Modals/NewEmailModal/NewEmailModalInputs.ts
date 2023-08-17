import { NewEmailModalInput } from './NewEmailModal.types'

const newEmailModalInputs: NewEmailModalInput[] = [
  {
    id: 0,
    name: 'code',
    prepend: 'bi bi-shield-check',
    placeholder: 'Введите код аутентификации',
  },
  {
    id: 1,
    name: 'email',
    type: 'email',
    prepend: 'bi bi-key',
    placeholder: 'Введите новую почту',
  },
]

export default newEmailModalInputs
