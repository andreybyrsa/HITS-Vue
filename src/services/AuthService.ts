import User from '@Domain/User'

const loginUser = async (username: string, password: string) => {
  const user: User = {
    username,
    firstName: 'Andrey',
    lastName: 'Byrsa',
    password,
  }

  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => user,
  )
}

const AuthService = {
  loginUser,
}

export default AuthService
