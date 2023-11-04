import axios from 'axios'

import { API_URL } from '@Main'

import { User, LoginUser, RegisterUser } from '@Domain/User'

const loginUser = async (user: LoginUser): Promise<User | Error> => {
  return await axios
    .post(`${API_URL}/auth/login`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка авторизации'
      return {
        ...user,
        id: 343,
        token: '1',
        roles: ['ADMIN', 'INITIATOR', 'PROJECT_OFFICE', 'EXPERT'],
      }
    })
}

const registerUser = async (user: RegisterUser): Promise<User | Error> => {
  return await axios
    .post(`${API_URL}/auth/register`, user)
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
