import { Idea, IdeaStatusType, IdeaSkills } from '@Domain/Idea'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { ideasMocks, ideasSkillsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const ideasAxios = defineAxios(ideasMocks)
const ideaSkillsAxios = defineAxios(ideasSkillsMocks)

const getIdeas = async (token: string): Promise<Idea[] | Error> => {
  return ideasAxios
    .get('/idea/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идей'))
}

const getInitiatorIdeas = async (token: string): Promise<Idea[] | Error> => {
  return ideasAxios
    .get('/idea/initiator/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идей'))
}

const getExpertNotConfirmedIdeas = async (
  token: string,
): Promise<Idea[] | Error> => {
  return ideasAxios
    .get(`/idea/all/on-confirmation`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения идей'))
}

const getIdea = async (id: string, token: string): Promise<Idea | Error> => {
  return ideasAxios
    .get(
      `/idea/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идеи'))
}

const getInitiatorIdea = async (
  id: string,
  token: string,
): Promise<Idea | Error> => {
  return ideasAxios
    .get(
      `/idea/initiator/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки идеи'))
}

const getIdeaSkills = async (
  ideaId: string,
  token: string,
): Promise<IdeaSkills | Error> => {
  return ideaSkillsAxios
    .get(
      `/idea/skills/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки компетенций идеи'))
}

const createIdeaSkills = async (
  ideaSkills: IdeaSkills,
  token: string,
): Promise<IdeaSkills | Error> => {
  return ideaSkillsAxios
    .post('/idea/skills/add', ideaSkills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания компетенций идеи'))
}

const saveAndSendIdeaOnApproval = async (
  idea: Idea,
  token: string,
): Promise<Idea | Error> => {
  return ideasAxios
    .post('/idea/add', idea, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления идеи'))
}

const saveIdeaDraft = async (idea: Idea, token: string): Promise<Idea | Error> => {
  return ideasAxios
    .post('/idea/draft/add', idea, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления идеи'))
}

const updateIdea = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return ideasAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования идеи'))
}

const updateIdeaByAdmin = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return ideasAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования идеи'))
}

const updateIdeaSkills = async (
  ideaId: string,
  ideaSkills: IdeaSkills,
  token: string,
): Promise<IdeaSkills | Error> => {
  return ideaSkillsAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка обновления компетенций идеи'))
}

const checkIdea = async (id: string, token: string): Promise<void | Error> => {
  return ideasAxios
    .putNoRequestBody<void>(
      `/idea/check/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { isChecked: true } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка просмотра идеи'))
}

const sendIdeaOnApproval = async (
  id: string,
  status: IdeaStatusType,
  token: string,
): Promise<Success | Error> => {
  return ideasAxios
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
    .catch((error) =>
      handleAxiosError(error, 'Ошибка отправки идеи на согласование'),
    )
}

const updateIdeaStatus = async (
  id: string,
  status: IdeaStatusType,
  token: string,
): Promise<Success | Error> => {
  return ideasAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка обновления статуса идеи'))
}

const deleteIdeaByAdmin = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return ideasAxios
    .delete(
      `/idea/admin/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления идеи'))
}

const deleteIdea = async (id: string, token: string): Promise<Success | Error> => {
  return ideasAxios
    .delete(
      `/idea/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления идеи'))
}

const IdeasService = {
  getIdeas,
  getInitiatorIdeas,
  getIdea,
  getInitiatorIdea,
  getIdeaSkills,
  getExpertNotConfirmedIdeas,

  saveIdeaDraft,
  createIdeaSkills,
  saveAndSendIdeaOnApproval,

  updateIdea,
  updateIdeaSkills,
  sendIdeaOnApproval,
  updateIdeaStatus,
  updateIdeaByAdmin,
  checkIdea,

  deleteIdea,
  deleteIdeaByAdmin,
}

export default IdeasService
