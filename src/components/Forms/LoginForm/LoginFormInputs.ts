import { LoginInputType } from './LoginForm.types'

export const loginInputs: LoginInputType[] = [
  {
    key: 'email',
    type: 'email',
    name: 'email',
    placeholder: 'Введите логин',
    prepend: '@',
  },
  {
    key: 'password',
    type: 'password',
    name: 'password',
    placeholder: 'Введите пароль',
    prependIcon: 'bi bi-key',
  },
]
