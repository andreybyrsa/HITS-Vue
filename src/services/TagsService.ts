import axios from 'axios'

import { API_URL } from '@Main'

import { Tag } from '@Domain/Tag'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { tagsMocks } from '@Utils/getMocks'
import { Project } from '@Domain/Project'

const tagsAxios = defineAxios(tagsMocks)

const getAllTags = async (token: string): Promise<Tag[] | Error> => {
  return tagsAxios
    .get('/scrum-service/tag/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения тегов'))
}

// const getAllProjectTags = async (token: string): Promise<Project[] | Error> => {
//   return axios
//     .get(`tag/project`, {
//       headers: { Authorization: `Bearer ${token}` },
//       signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
//     })
//     .then((response) => response.data)
//     .catch((error) => handleAxiosError(error, 'Ошибка получения тегов проекта'))
// }

const createTag = async (tag: Tag, token: string): Promise<Tag | Error> => {
  return tagsAxios
    .post('/scrum-service/tag/add', tag, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления тега'))
}

const createNoConfirmedTag = async (
  tag: Tag,
  token: string,
): Promise<Tag | Error> => {
  return tagsAxios
    .post('/scrum-service/tag/add/no-confirmed', tag, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления компетенции'))
}

const confirmTag = async (
  tag: Tag,
  id: string,
  token: string,
): Promise<Tag | Error> => {
  return tagsAxios
    .put(
      `/scrum-service/tag/confirm/${id}`,
      tag,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка утверждения тега'))
}

const updateTag = async (
  tag: Tag,
  id: string,
  token: string,
): Promise<Tag | Error> => {
  return tagsAxios
    .put(
      `/scrum-service/tag/update/${id}`,
      tag,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования тега'))
}

const deleteTag = async (id: string, token: string): Promise<Success | Error> => {
  return tagsAxios
    .delete(
      `/scrum-service/tag/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления тега'))
}

const TagsService = {
  getAllTags,

  createTag,
  createNoConfirmedTag,

  confirmTag,
  updateTag,
  deleteTag,
}

export default TagsService
