import { User, LoginUser } from '@Domain/User'

const loginUser = async (user: LoginUser): Promise<User> => {
  const responseUser: User = {
    token: '123213',
    username: user.username,
    email: 'new@mail.com',
    firstName: 'Andrey',
    lastName: 'Byrsa',
    password: user.password,
    roles: ['ADMIN', 'INITIATOR'],
    role: 'ADMIN',
  }

  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => responseUser,
  )
}

const AuthService = {
  loginUser,
}

export default AuthService
