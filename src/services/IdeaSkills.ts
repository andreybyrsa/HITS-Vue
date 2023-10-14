import { IdeaSkills } from '@Domain/Idea'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const ideaSkillsAxios = defineAxios(getMocks().ideasSkills)

const getIdeaSkills = async (
  ideaId: string,
  token: string,
): Promise<IdeaSkills | Error> => {
  return await ideaSkillsAxios
    .get(
      `/idea/skills/${ideaId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const createIdeaSkills = async (
  ideaId: string,
  ideaSkills: IdeaSkills,
  token: string,
): Promise<IdeaSkills | Error> => {
  return await ideaSkillsAxios
    .post(`/idea/skills/create/${ideaId}`, ideaSkills, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const updateIdeaSkills = async (
  ideaId: string,
  ideaSkills: IdeaSkills,
  token: string,
): Promise<IdeaSkills | Error> => {
  return await ideaSkillsAxios
    .put(
      `/idea/skills/create/${ideaId}`,
      ideaSkills,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const IdeaSkillsService = {
  getIdeaSkills,
  createIdeaSkills,
  updateIdeaSkills,
}

export default IdeaSkillsService
