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
        id: '10',
        token: '1',
        ...user,
        firstName: 'Кирилл',
        lastName: 'Власов',
        roles: [
          'ADMIN',
          'TEAM_LEADER',
          'MEMBER',
          'EXPERT',
          'INITIATOR',
          'PROJECT_OFFICE',
        ],
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
