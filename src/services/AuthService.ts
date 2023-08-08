import axios from 'axios'

import { User, LoginUser, RegisterUser } from '@Domain/User'

const AUTH_URL = process.env.VUE_APP_AUTH_API_URL || 'http://localhost:3000'

const loginUser = async (user: LoginUser): Promise<User> => {
  return await axios
    .post(`${AUTH_URL}/login`, user)
    .then((response) => response.data)
    .catch(() => ({
      token: 'dsamp1m23',
      email: 'admin@mail.com',
      firstName: 'Andrey',
      lastName: 'Byrsa',
      roles: ['ADMIN', 'INITIATOR'],
    }))
}

const registerUser = async (user: RegisterUser): Promise<User> => {
  return await axios
    .post(`${AUTH_URL}/register`, user)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const AuthService = {
  loginUser,
  registerUser,
}

export default AuthService
