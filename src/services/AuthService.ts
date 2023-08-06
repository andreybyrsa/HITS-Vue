import axios from 'axios'

import { User, LoginUser, RegisterUser } from '@Domain/User'
import { InvitationInfo, InvitationForm } from '@Domain/Invitation'
import ResponseMessage from '@Domain/ResponseMessage'

const AUTH_URL = process.env.VUE_APP_AUTH_API_URL || 'http://localhost:3000'
const INVITE_URL = process.env.VUE_APP_INVITATION_URL || 'http://localhost:3000'

const loginUser = async (user: LoginUser): Promise<User> => {
  return await axios
    .post(`${AUTH_URL}/login`, user)
    .then((response) => response.data)
    .catch((error) => console.warn(`login ${error}`))
}

const registerUser = async (user: RegisterUser): Promise<User> => {
  return await axios
    .post(`${AUTH_URL}/register`, user)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const inviteUserByEmail = async (
  userData: InvitationForm,
): Promise<ResponseMessage> => {
  return await axios
    .post(`${INVITE_URL}/email`, userData)
    .then((response) => response.data)
    .catch((error) => console.warn(`invite ${error}`))
}

const getInvitationInfo = async (slug: string): Promise<InvitationInfo> => {
  return await axios
    .get(`${INVITE_URL}/get-invitation/${slug}`)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const AuthService = {
  loginUser,
  registerUser,
  inviteUserByEmail,
  getInvitationInfo,
}

export default AuthService
