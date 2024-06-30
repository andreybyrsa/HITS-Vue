import { MODE } from '@Main'
import axios from 'axios'

const serverUrl: string = process.env.VUE_APP_OAUTH_URL || ''
axios.defaults.baseURL = serverUrl

const clientId: string = process.env.VUE_APP_OAUTH_CLIENT_ID || ''
const authHeaderValue: string = process.env.VUE_APP_OAUTH_AUTH_HEADER || ''
const redirectUri: string = process.env.VUE_APP_OAUTH_REDIRECT_URI || ''
const urlParam: string = process.env.VUE_APP_LOGOUT_URL || ''

export const ACCESS_TOKEN_KEY = 'access_token'

const DEV_USER = {
  active: true,
  sub: 'test@test.ru',
  aud: ['hits'],
  nbf: 1719164950,
  scope: 'openid',
  roles: [
    'INITIATOR',
    'TEAM_OWNER',
    'TEAM_LEADER',
    'MEMBER',
    'TEACHER',
    'PROJECT_OFFICE',
    'EXPERT',
    'ADMIN',
    'TEAM_LEADER',
    'TEAM_LEADER',
  ],
  iss: 'https://hits1.tyuiu.ru',
  exp: 1719166750,
  iat: 1719164950,
  user: {
    id: 'asd-qwe-123',
    email: 'test@test.ru',
    lastName: 'Фамилия',
    firstName: 'Имя',
    isDeleted: false,
    roles: [
      'INITIATOR',
      'TEAM_OWNER',
      'TEAM_LEADER',
      'MEMBER',
      'TEACHER',
      'PROJECT_OFFICE',
      'EXPERT',
      'ADMIN',
      'TEAM_LEADER',
      'TEAM_LEADER',
    ],
    createdAt: null,
    studyGroup: 'ГРУППА-00-0',
    telephone: '+7(000)-000-00-00',
  },
  jti: 'asd-qwe-123',
  client_id: 'hits',
  token_type: 'Bearer',
}

const setDevToken = () => {
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, DEV_USER.jti)
}

const login = () => {
  if (MODE === 'DEVELOPMENT') {
    setDevToken()
    return
  }

  const requestParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid',
  })
  window.location.href = serverUrl + '/oauth2/authorize?' + requestParams.toString()
}

const logout = () => {
  const requestParams = new URLSearchParams({
    url: urlParam,
  })
  window.location.href = serverUrl + '/auth/logout?' + requestParams.toString()
}

const getTokens = async (code: string) => {
  if (MODE === 'DEVELOPMENT') {
    setDevToken()
    return
  }

  const payload = new FormData()
  payload.append('grant_type', 'authorization_code')
  payload.append('code', code)
  payload.append('redirect_uri', redirectUri)
  payload.append('client_id', clientId)

  try {
    const response = await axios.post('/oauth2/token', payload, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: authHeaderValue,
      },
    })
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, response.data[ACCESS_TOKEN_KEY])
  } catch (error) {
    console.error('Ошибка при получении токенов: ' + error)
  }
}

const getTokenInfo = async () => {
  if (MODE === 'DEVELOPMENT') {
    return DEV_USER.user
  }
  const token = window.sessionStorage.getItem(ACCESS_TOKEN_KEY) || ''
  const payload = new FormData()
  payload.append('token', window.sessionStorage.getItem(ACCESS_TOKEN_KEY) || '')
  try {
    const response = await axios.post('/oauth2/introspect', payload, {
      headers: {
        Authorization: authHeaderValue,
        token,
      },
    })
    return response.data.user
  } catch (error) {
    console.error('Ошибка при получении информации о токене: ' + error)
    return new Error('Сессия истекла')
  }
}

const LoginService = {
  login,
  logout,
  getTokens,
  getTokenInfo,
}

export default LoginService
