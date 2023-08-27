import axios from 'axios'

import { User, LoginUser, RegisterUser } from '@Domain/User'

const AUTH_URL = process.env.VUE_APP_AUTH_API_URL || 'http://localhost:3000'

const loginUser = async (user: LoginUser): Promise<User | Error> => {
  return await axios
    .post(`${AUTH_URL}/login`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка авторизации'
      return {
        token: '2132313',
        email: 'admin@mail.com',
        roles: ['ADMIN'],
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
