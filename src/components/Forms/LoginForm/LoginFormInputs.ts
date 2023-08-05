import LoginInputType from './LoginForm.types'

const loginInputs: LoginInputType[] = [
  {
    key: 'email',
    type: 'email',
    placeholder: 'Введите логин',
    prepend: '@',
  },
  {
    key: 'password',
    type: 'password',
    placeholder: 'Введите пароль',
    prependIcon: 'bi bi-key',
  },
]

export default loginInputs
