import { Success, Idea, IdeaStatusType, IdeaSkills } from '@Domain'
import { defineAxios, ideasMocks, ideasSkillsMocks } from '@Utils'

const ideasDefineApi = defineAxios(ideasMocks)
const ideaSkillsDefineApi = defineAxios(ideasSkillsMocks)

const get = async (id: string): Promise<Idea | Error> => {
  const response = await ideasDefineApi.get(`/idea/${id}`, {}, { params: { id } })
  return response.data
}

const getAll = async (): Promise<Idea[] | Error> => {
  const response = await ideasDefineApi.get('/idea/all')
  return response.data
}

const getAllOnConfirmation = async (): Promise<Idea[] | Error> => {
  const response = await ideasDefineApi.get('/idea/all/on-confirmation')
  return response.data
}

const getAllInitiator = async (): Promise<Idea[] | Error> => {
  const response = await ideasDefineApi.get('/idea/initiator/all')
  return response.data
}

const getInitiator = async (id: string): Promise<Idea | Error> => {
  const response = await ideasDefineApi.get(
    `/idea/initiator/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

const getSkills = async (id: string): Promise<IdeaSkills[] | Error> => {
  const response = await ideaSkillsDefineApi.get(`/idea/skills/${id}`, {
    params: { id },
  })
  return response.data
}

const create = async (idea: Idea): Promise<Idea | Error> => {
  const response = await ideasDefineApi.post('/idea/add', idea)
  return response.data
}

const createSkills = async (skills: IdeaSkills): Promise<IdeaSkills | Error> => {
  const response = await ideaSkillsDefineApi.post('/idea/skills/add', skills)
  return response.data
}

const createDraft = async (idea: Idea): Promise<Idea | Error> => {
  const response = await ideasDefineApi.post('/idea/draft/add', idea)
  return response.data
}

const update = async (idea: Idea, id: string): Promise<Success | Error> => {
  const response = await ideasDefineApi.put<Success>(
    `/idea/initiator/update/${id}`,
    idea,
    {},
    { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
  )
  return response.data
}

const updateByAdmin = async (idea: Idea, id: string): Promise<Success | Error> => {
  const response = await ideasDefineApi.put<Success>(
    `/idea/admin/update/${id}`,
    idea,
    {},
    { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
  )
  return response.data
}

const updateSkills = async (
  ideaId: string,
  ideaSkills: IdeaSkills,
): Promise<IdeaSkills | Error> => {
  const response = await ideaSkillsDefineApi.put(
    '/idea/skills/update',
    ideaSkills,
    {},
    { params: { ideaId } },
  )
  return response.data
}

const check = async (id: string): Promise<void | Error> => {
  const response = await ideasDefineApi.putNoRequestBody<void>(
    `/idea/check/${id}`,
    {},
    { params: { id }, requestData: { isChecked: true } },
  )
  return response.data
}

const send = async (
  id: string,
  status: IdeaStatusType,
): Promise<Success | Error> => {
  const response = await ideasDefineApi.putNoRequestBody<Success>(
    `/idea/initiator/send/${id}`,
    {},
    {
      params: { id },
      requestData: { status },
      responseData: { success: 'Успешная отправка идеи' },
    },
  )
  return response.data
}

const updateStatus = async (
  id: string,
  status: IdeaStatusType,
): Promise<Success | Error> => {
  const response = await ideasDefineApi.put<Success>(
    `/idea/status/update/${id}`,
    { status: status },
    {},
    { params: { id }, responseData: { success: 'Статус идеи изменен' } },
  )
  return response.data
}

const remove = async (id: string): Promise<Success | Error> => {
  const response = await ideasDefineApi.delete(
    `/idea/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

const removeByAdmin = async (id: string): Promise<Success | Error> => {
  const response = await ideasDefineApi.delete(
    `/idea/admin/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

export const IdeaService = {
  get,
  getAll,
  getInitiator,
  getAllInitiator,
  getSkills,
  getAllOnConfirmation,

  create,
  createDraft,
  createSkills,
  send,
  check,
  update,
  updateSkills,
  updateStatus,
  updateByAdmin,

  remove,
  removeByAdmin,
}
