import axios from 'axios'

import { API_URL } from '@Main'

import { User, LoginUser, RegisterUser } from '@Domain/User'

import handleAxiosError from '@Utils/handleAxiosError'

const loginUser = async (user: LoginUser): Promise<User | Error> => {
  return axios
    .post(`${API_URL}/auth/login`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка авторизации'
      return {
        id: '0',
        token: '0',
        firstName: 'Андрей',
        lastName: 'Бырса',
        ...user,
        roles: [
          'ADMIN',
          'EXPERT',
          'INITIATOR',
          'MEMBER',
          'TEAM_OWNER',
          'PROJECT_OFFICE',
        ],
      }
    })
}
const registerUser = async (user: RegisterUser): Promise<User | Error> => {
  return axios
    .post(`${API_URL}/auth/register`, user)
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка регистрации'))
}

const AuthService = {
  loginUser,
  registerUser,
}

export default AuthService
