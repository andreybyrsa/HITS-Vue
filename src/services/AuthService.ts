import axios from 'axios'

import { User, LoginUser, RegisterUser } from '@Domain/User'
import ResponseMessage from '@Domain/ResponseMessage'

const AUTH_URL = process.env.VUE_APP_AUTH_API_URL || 'http://localhost:3000'

const loginUser = async (user: LoginUser): Promise<User & ResponseMessage> => {
  return await axios
    .post(`${AUTH_URL}/login`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const { error } = response.data
      return { error }
    })
}

const registerUser = async (
  user: RegisterUser,
): Promise<User & ResponseMessage> => {
  return await axios
    .post(`${AUTH_URL}/register`, user)
    .then((response) => response.data)
    .catch(({ response }) => {
      const { error } = response.data
      return { error }
    })
}

const AuthService = {
  loginUser,
  registerUser,
}

export default AuthService
