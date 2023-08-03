import User from '@Domain/User'

const loginUser = async (username: string) => {
  const user: User = {
    username,
    firstName: 'Andrey',
    lastName: 'Byrsa',
    password: '12345',
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
}) => {
  const userData: User = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
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
