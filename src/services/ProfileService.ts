import Profile from '@Domain/Profile'
import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const profilesAxios = defineAxios(getMocks().profiles)

const getProfile = async (
  userId: number,
  token: string,
): Promise<Profile | Error> => {
  return await profilesAxios
    .get(
      `/profile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { userId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения профиля'
      return new Error(error)
    })
}

const getAllProfiles = async (token: string): Promise<Profile[] | Error> => {
  return await profilesAxios
    .get(`/profile/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения профиля'
      return new Error(error)
    })
}

const ProfileService = {
  getProfile,
  getAllProfiles,
}

export default ProfileService
