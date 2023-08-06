import axios from 'axios'

import { User, LoginUser, RegisterUser } from '@Domain/User'

const AUTH_URL = process.env.VUE_APP_AUTH_API_URL || 'http://localhost:3000'

const loginUser = async (user: LoginUser): Promise<User> => {
  return await axios
    .post(`${AUTH_URL}/login`, user)
    .then((response) => response.data)
    .catch((error) => console.warn(`login ${error}`))
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
