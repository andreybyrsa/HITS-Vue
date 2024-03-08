import { api } from '@Api'
import { Profile, ProfileFullName, Skill, Success, TeamExperience } from '@Domain'
import { TryCatch, defineAxios, profilesMocks, teamsExperienceMocks } from '@Utils'

const profileUserDefineApi = defineAxios(profilesMocks)
const teamExperienceDefineApi = defineAxios(teamsExperienceMocks)

const filterTeamExperienceByUserId = (
  teamExperience: TeamExperience[],
  id: string,
) => {
  return teamExperience.filter(({ userId }) => userId == id)
}

export class ProfileService {
  @TryCatch
  static async getUserProfile(id: string): Promise<Profile | Error> {
    const response = await profileUserDefineApi.get(
      `/profile/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async getProfileAvatar(id: string): Promise<string | Error> {
    const response = await api.get(`/profile/avatar/get/${id}`)
    return response?.data
  }

  @TryCatch
  static async getTeamExperience(userId: string): Promise<TeamExperience[] | Error> {
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

  @TryCatch
  static async saveProfileSkills(skills: Skill[]): Promise<Skill[] | Error> {
    const response = await api.post('/profile/skills/save', skills)
    return response.data
  }

  @TryCatch
  static async uploadProfileAvatar(formData: FormData): Promise<string | Error> {
    const response = await api.post('/profile/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response?.data
  }

  @TryCatch
  static async updateUserFullName(
    fullName: ProfileFullName,
  ): Promise<Success | Error> {
    const response = await api.put('/profile/fullname/update', fullName)
    return response?.data
  }
}
