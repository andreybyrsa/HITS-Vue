import axios from 'axios'

const serverUrl: string = process.env.VUE_APP_OAUTH_URL || ''
axios.defaults.baseURL = serverUrl

const clientId: string = process.env.VUE_APP_OAUTH_CLIENT_ID || ''
const authHeaderValue: string = process.env.VUE_APP_OAUTH_AUTH_HEADER || ''
const redirectUri: string = process.env.VUE_APP_OAUTH_REDIRECT_URI || ''
const urlParam: string = process.env.VUE_APP_LOGOUT_URL || ''

export const ACCESS_TOKEN_KEY = 'access_token'

const login = async () => {
  const requestParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid',
  })
  window.location.href = serverUrl + '/oauth2/authorize?' + requestParams.toString()
}

const logout = async () => {
  const requestParams = new URLSearchParams({
    url: urlParam,
  })
  window.location.href = serverUrl + '/auth/logout?' + requestParams.toString()
}

const getTokens = async (code: string) => {
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
    console.error('Error getting tokens: ' + error)
  }
}

const getTokenInfo = async () => {
  const payload = new FormData()
  payload.append('token', window.sessionStorage.getItem(ACCESS_TOKEN_KEY) || '')
  try {
    const response = await axios.post('/oauth2/introspect', payload, {
      headers: {
        Authorization: authHeaderValue,
      },
    })
    return response.data.user
  } catch (error) {
    console.error('Error getting token info: ' + error)
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
