import { api } from '@Api'
import { Profile, ProfileFullName } from '@Domain/Profile'
import Success from '@Domain/ResponseMessage'
import { TeamExperience } from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import { profilesMocks, teamsExperienceMocks } from '@Utils/getMocks'
import defineAxios from '@Utils/defineAxios'

const profileUserDefineApi = defineAxios(profilesMocks)
const teamExperienceDefineApi = defineAxios(teamsExperienceMocks)

const filterTeamExperienceByUserId = (
  teamExperience: TeamExperience[],
  id: string,
) => {
  return teamExperience.filter(({ userId }) => userId == id)
}

const getUserProfile = async (id: string): Promise<Profile | Error> => {
  const response = await profileUserDefineApi.get(
    `/profile/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

const getProfileAvatar = async (id: string): Promise<string | Error> => {
  const response = await api.get(`/profile/avatar/get/${id}`)
  return response.data
}

const getTeamExperience = async (
  userId: string,
): Promise<TeamExperience[] | Error> => {
  const response = await teamExperienceDefineApi.get<TeamExperience[]>(
    '/profile/avatar/get',
    {},
    {
      formatter: (teamExperience) =>
        filterTeamExperienceByUserId(teamExperience, userId),
    },
  )
  return response.data
}

const saveProfileSkills = async (skills: Skill[]): Promise<Skill[] | Error> => {
  const response = await api.post('/profile/skills/save', skills)
  return response.data
}

const uploadProfileAvatar = async (formData: FormData): Promise<string | Error> => {
  const response = await api.post('/profile/avatar/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const updateUserFullName = async (
  fullName: ProfileFullName,
): Promise<Success | Error> => {
  const response = await api.put('/profile/fullname/update', fullName)
  return response.data
}

export const ProfileService = {
  getUserProfile,
  getProfileAvatar,
  getTeamExperience,
  saveProfileSkills,
  uploadProfileAvatar,
  updateUserFullName,
}
