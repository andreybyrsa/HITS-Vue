import { Idea } from '@Domain/Idea'
import Success from '@Domain/ResponseMessage'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const ideasAxios = defineAxios(getMocks().ideas)

const getIdeas = async (token: string): Promise<Idea[] | Error> => {
  return await ideasAxios
    .get('/idea/all', {
      headers: { Authorization: `Bearer ${token}` },
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
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идеи'
      return new Error(error)
    })
}

const createIdea = async (idea: Idea, token: string): Promise<Idea | Error> => {
  return await ideasAxios
    .post('/idea/add', idea, { headers: { Authorization: `Bearer ${token}` } })
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
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const sendIdeaOnApproval = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .putNoRequestBody<Success>(
      `/idea/initiator/send/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      {
        params: { id },
        requestData: { status: 'ON_APPROVAL' },
        responseData: { success: 'Успешная отправка идеи' },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки идеи на согласование'
      return new Error(error)
    })
}

const deleteIdea = async (id: string, token: string): Promise<Success | Error> => {
  return await ideasAxios
    .delete(
      `/idea/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления идеи'
      return new Error(error)
    })
}

const updateIdeaStatusByProjectOffice = async (
  id: string,
  status: IdeaStatusTypes,
  token: string,
): Promise<Success | Error> => {
  return await ideasAxios
    .put<Success>(
      `/idea/project-office/update/${id}`,
      { status: status },
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, responseData: { success: 'Статус идеи изменен' } },
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
): Promise<Idea | Error> => {
  return await ideasAxios
    .put(
      `/idea/admin/update/${id}`,
      idea,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
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
      { headers: { Authorization: `Bearer ${token}` } },
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
  getIdea,

  createIdea,

  updateIdea,
  sendIdeaOnApproval,
  updateIdeaStatusByProjectOffice,
  updateIdeaByAdmin,

  deleteIdea,
  deleteIdeaByAdmin,
}

export default IdeasService
