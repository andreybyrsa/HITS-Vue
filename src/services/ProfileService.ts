import { ProfileSkills } from '@Domain/Profile'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const profileAxios = defineAxios(getMocks().profileSkills)

const getProfileSkills = async (
  userId: string,
  token: string,
): Promise<ProfileSkills | Error> => {
  return await profileAxios
    .get(
      '/profile/skills',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { userId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const profileService = {
  getProfileSkills,
}

export default profileService
