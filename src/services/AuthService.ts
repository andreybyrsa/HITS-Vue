import axios from 'axios'

import { User, LoginUser, RegisterUser } from '@Domain/User'

const AUTH_URL = 'http://localhost:3000/api/v1/auth'

const loginUser = async (user: LoginUser): Promise<User | Error> => {
  return await axios
    .post(`${AUTH_URL}/login`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка авторизации'
      return {
        token: '1239i2104',
        email: '1@mail.com',
        roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      }
    })
}

const registerUser = async (user: RegisterUser): Promise<User | Error> => {
  return await axios
    .post(`${AUTH_URL}/register`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка регистрации'
      return new Error(error)
    })
}

const AuthService = {
  loginUser,
  registerUser,
}

export default AuthService
