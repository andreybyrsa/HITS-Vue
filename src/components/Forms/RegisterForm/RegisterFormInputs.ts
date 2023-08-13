import RegisterInputType from './RegisterForm.types'

const registerInputs: RegisterInputType[] = [
  {
    key: 'email',
    type: 'email',
    name: 'email',
    placeholder: 'Введите почту',
    prepend: '@',
    disabled: true,
  },
  {
    key: 'firstName',
    name: 'firstName',
    placeholder: 'Введите имя',
    prependIcon: 'bi bi-fonts',
  },
  {
    key: 'lastName',
    name: 'lastName',
    placeholder: 'Введите фамилию',
    prependIcon: 'bi bi-fonts',
  },
  {
    key: 'password',
    type: 'password',
    name: 'password',
    placeholder: 'Введите пароль',
    prependIcon: 'bi bi-key',
  },
]

export default registerInputs
