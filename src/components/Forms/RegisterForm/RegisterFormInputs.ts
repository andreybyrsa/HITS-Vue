import RegisterInputType from './RegisterForm.types'

const registerInputs: RegisterInputType[] = [
  {
    key: 'email',
    type: 'email',
    placeholder: 'Введите почту',
    prepend: '@',
  },
  {
    key: 'firstName',
    placeholder: 'Введите имя',
    prependIcon: 'bi bi-fonts',
  },
  {
    key: 'lastName',
    placeholder: 'Введите фамилию',
    prependIcon: 'bi bi-fonts',
  },
  {
    key: 'password',
    type: 'password',
    placeholder: 'Введите пароль',
    prependIcon: 'bi bi-key',
  },
]

export default registerInputs
