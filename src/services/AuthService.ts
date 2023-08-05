import { User, LoginUser } from '@Domain/User'

const loginUser = async (user: LoginUser): Promise<User> => {
  const responseUser: User = {
    token: '123213',
    username: user.username,
    email: 'new@mail.com',
    firstName: 'Andrey',
    lastName: 'Byrsa',
    roles: ['ADMIN', 'INITIATOR'],
    role: 'ADMIN',
  }

  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => responseUser,
  )
}

const registerUser = async (user: {
  username: string
  firstName: string
  lastName: string
  password: string
  token: string
  roles: string[]
  role: string
}) => {
  const userData: User = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
    token: '$route.params.id',
    roles: ['INITIATOR'],
    role: 'INITIATOR',
  }
  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => userData,
  )
}

const AuthService = {
  loginUser,
  registerUser,
}

export default AuthService
