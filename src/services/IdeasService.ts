import { Idea, IdeaSkills } from '@Domain/Idea'
import Success from '@Domain/ResponseMessage'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const ideasAxios = defineAxios(getMocks().ideas)
const ideaSkillsAxios = defineAxios(getMocks().ideasSkills)

const getIdeas = async (token: string): Promise<Idea[] | Error> => {
  return await ideasAxios
    .get('/idea/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getInitiatorIdeas = async (token: string): Promise<Idea[] | Error> => {
  return await ideasAxios
    .get('/idea/initiator/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getIdea = async (id: string, token: string): Promise<Idea | Error> => {
  return await ideasAxios
    .get(
      `/idea/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идеи'
      return new Error(error)
    })
}

const getInitiatorIdea = async (
  id: string,
  token: string,
): Promise<Idea | Error> => {
  return await ideasAxios
    .get(
      `/idea/initiator/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идеи'
      return new Error(error)
    })
}

const getIdeaSkills = async (
  ideaId: string,
  token: string,
): Promise<IdeaSkills | Error> => {
  return await ideaSkillsAxios
    .get(
      `/idea/skills/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const createIdeaSkills = async (
  ideaSkills: IdeaSkills,
  token: string,
): Promise<IdeaSkills | Error> => {
  return await ideaSkillsAxios
    .post('/idea/skills/add', ideaSkills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const saveAndSendIdeaOnApproval = async (
  idea: Idea,
  token: string,
): Promise<Idea | Error> => {
  return await ideasAxios
    .post('/idea/add', idea, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления идеи'
      return new Error(error)
    })
}

const saveIdeaDraft = async (idea: Idea, token: string): Promise<Idea | Error> => {
  return await ideasAxios
    .post('/idea/draft/add', idea, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления идеи'
      return new Error(error)
    })
}

const updateIdea = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .put<Success>(
      `/idea/initiator/update/${id}`,
      idea,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const updateIdeaByAdmin = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .put<Success>(
      `/idea/admin/update/${id}`,
      idea,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
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
      '/idea/skills/update',
      ideaSkills,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций идеи'
      return new Error(error)
    })
}

const sendIdeaOnApproval = async (
  id: string,
  status: IdeaStatusTypes,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .putNoRequestBody<Success>(
      `/idea/initiator/send/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id },
        requestData: { status },
        responseData: { success: 'Успешная отправка идеи' },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки идеи на согласование'
      return new Error(error)
    })
}

const updateIdeaStatus = async (
  id: string,
  status: IdeaStatusTypes,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .put<Success>(
      `/idea/status/update/${id}`,
      { status: status },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Статус идеи изменен' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const deleteIdeaByAdmin = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .delete(
      `/idea/admin/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления идеи'
      return new Error(error)
    })
}

const deleteIdea = async (id: string, token: string): Promise<Success | Error> => {
  return await ideasAxios
    .delete(
      `/idea/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления идеи'
      return new Error(error)
    })
}

const IdeasService = {
  getIdeas,
  getInitiatorIdeas,
  getIdea,
  getInitiatorIdea,
  getIdeaSkills,

  saveIdeaDraft,
  createIdeaSkills,
  saveAndSendIdeaOnApproval,

  updateIdea,
  updateIdeaSkills,
  sendIdeaOnApproval,
  updateIdeaStatus,
  updateIdeaByAdmin,

  deleteIdea,
  deleteIdeaByAdmin,
}

export default IdeasService
