import User from '@Domain/User'

const loginUser = async (username: string) => {
  const user: User = {
    token: '123213',
    username,
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
