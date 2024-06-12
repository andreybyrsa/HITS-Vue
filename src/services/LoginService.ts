import axios from 'axios'

const serverUrl: string = process.env.VUE_APP_OAUTH_URL || ''
axios.defaults.baseURL = serverUrl

const clientId: string = process.env.VUE_APP_OAUTH_CLIENT_ID || ''
const authHeaderValue: string = process.env.VUE_APP_OAUTH_AUTH_HEADER || ''
const redirectUri: string = process.env.VUE_APP_OAUTH_REDIRECT_URI || ''

const ACCESS_TOKEN_KEY = 'access_token'

const login = () => {
  const requestParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid',
  })
  window.location.href = serverUrl + '/oauth2/authorize?' + requestParams.toString()
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
    console.log('Result getting tokens: ' + JSON.stringify(response.data))
    await window.sessionStorage.setItem(
      ACCESS_TOKEN_KEY,
      response.data[ACCESS_TOKEN_KEY],
    )
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
    console.log('Result getting token info: ' + JSON.stringify(response.data))
    return response.data.user
  } catch (error) {
    console.error('Error getting token info: ' + error)
    throw error
  }
}

const LoginService = {
  login,
  getTokens,
  getTokenInfo,
}

export default LoginService
