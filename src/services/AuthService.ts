import axios from 'axios'

import { API_URL } from '@Main'

import { User, LoginUser, RegisterUser } from '@Domain/User'

import handleAxiosError from '@Utils/handleAxiosError'

const loginUser = async (user: LoginUser): Promise<User | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/auth/login`, user)
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка авторизации'))
}

const registerUser = async (user: RegisterUser): Promise<User | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/auth/register`, user)
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка регистрации'))
}

const AuthService = {
  loginUser,
  registerUser,
}

export default AuthService
