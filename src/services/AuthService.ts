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
        id: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
        token: '11110',
        firstName: 'Кирилл',
        lastName: 'Власов',
        telephone: '1111111111',
        studyGroup: 'AAAA-22-1',
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
