import { NewPasswordModalInput } from './NewPasswordModal.types'

const newPaswordModalInputs: NewPasswordModalInput[] = [
  {
    id: 0,
    name: 'code',
    prepend: 'bi bi-shield-check',
    placeholder: 'Введите код аутентификации',
  },
  {
    id: 1,
    name: 'password',
    type: 'password',
    prepend: 'bi bi-key',
    placeholder: 'Введите новый пароль',
  },
]

export default newPaswordModalInputs
