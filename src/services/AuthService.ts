import { User, LoginUser, RegisterUser } from '@Domain/User'

const loginUser = async (user: LoginUser): Promise<User> => {
  const responseUser: User = {
    token: '123213',
    username: 'andreybyrsa',
    email: user.email,
    firstName: 'Andrey',
    lastName: 'Byrsa',
    roles: ['ADMIN', 'INITIATOR'],
    role: 'ADMIN',
  }

  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => responseUser,
  )
}

const registerUser = async (user: RegisterUser): Promise<User> => {
  const responseUser: User = {
    token: '123213',
    username: 'andreybyrsa',
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: ['ADMIN', 'INITIATOR'],
    role: 'ADMIN',
  }

  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => responseUser,
  )
}

const sendRecoveryEmail = async (email: string) => {
  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
    console.log(`${email} sended`),
  )
}

const sendNewPassword = async (newPassword: string) => {
  return await new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
    console.log(`${newPassword} sended`),
  )
}

const AuthService = {
  loginUser,
  registerUser,
  sendRecoveryEmail,
  sendNewPassword,
}

export default AuthService
