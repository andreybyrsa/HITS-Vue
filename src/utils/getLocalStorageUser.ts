import { User } from '@Domain/User'

function getLocalStorageUser(): User {
  const localStorageUser = localStorage.getItem('user') ?? '{}'

  return JSON.parse(localStorageUser, (key: string, value: string) => {
    return key === 'lastActivity' ? new Date(value) : value
  })
}

export default getLocalStorageUser
