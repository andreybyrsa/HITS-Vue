import axios from 'axios'

import { Idea } from '@Domain/Idea'
import Success from '@Domain/ResponseMessage'

const IDEAS_URL = process.env.VUE_APP_IDEAS_API_URL || 'http://localhost:3000'

const fetchIdeas = async (token: string): Promise<Idea[]> => {
  return await axios
    .get(`${IDEAS_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getInitiatorIdea = async (
  id: string,
  token: string,
): Promise<Idea | Error> => {
  return await axios
    .get(`${IDEAS_URL}/initiator/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идеи'
      return new Error(error)
    })
}

const postInitiatorIdea = async (
  idea: Idea,
  token: string,
): Promise<Idea | Error> => {
  return await axios
    .post(`${IDEAS_URL}/initiator/add`, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления идеи'
      return new Error(error)
    })
}

const putInitiatorIdea = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${IDEAS_URL}/initiator/update/${id}`, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const sendInitiatorIdeaOnApproval = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${IDEAS_URL}/initiator/send/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки идеи на согласование'
      return new Error(error)
    })
}

const deleteInitiatorIdea = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .delete(`${IDEAS_URL}/initiator/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления идеи'
      return new Error(error)
    })
}

const putProjectOfficeIdea = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${IDEAS_URL}/project-office/update/${id}`, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const putExpertIdea = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${IDEAS_URL}/admin/update/${id}`, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const putAdminIdea = async (
  idea: Idea,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${IDEAS_URL}/admin/update/${id}`, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования идеи'
      return new Error(error)
    })
}

const deleteAdminIdea = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .delete(`${IDEAS_URL}/admin/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления идеи'
      return new Error(error)
    })
}

const IdeasService = {
  fetchIdeas,

  getInitiatorIdea,
  postInitiatorIdea,
  putInitiatorIdea,
  sendInitiatorIdeaOnApproval,
  deleteInitiatorIdea,

  putProjectOfficeIdea,
  putExpertIdea,
  putAdminIdea,
  deleteAdminIdea,
}

export default IdeasService
