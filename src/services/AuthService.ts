import User from '@Domain/User'

const loginUser = async (username: string) => {
  const user: User = {
    token: '123213',
    username,
    email: 'new@mail.com',
    firstName: 'Andrey',
    lastName: 'Byrsa',
    password: '12345',
    roles: ['ADMIN', 'INITIATOR'],
    role: 'ADMIN',
  }

  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => user,
  )
}

const AuthService = {
  loginUser,
}

export default AuthService
