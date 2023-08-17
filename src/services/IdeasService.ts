import axios from 'axios'

import { Idea, Risk } from '@Domain/Idea'

const IDEAS_URL = process.env.VUE_APP_IDEAS_API_URL || 'http://localhost:3000'

const postInitiatorIdeas = async (idea: Idea, token: string): Promise<Idea> => {
  return await axios
    .post(`${IDEAS_URL}/initiator/add`, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const getInitiatorIdeas = async (token: string): Promise<Idea[]> => {
  return await axios
    .get(`${IDEAS_URL}/initiator`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

// const getProjectOfficeIdeas = async (status: string): Promise<Idea> => {
//   return await axios
//     .get(`${IDEAS_URL}/project-office`, status)
//     .then((response) => response.data)
//     .catch((error) => console.warn(error))
// }

// const getExpertIdeas = async (status: string): Promise<Idea> => {
//   return await axios
//     .get(`${IDEAS_URL}/expert`, status)
//     .then((response) => response.data)
//     .catch((error) => console.warn(error))
// }

const getAdminIdeas = async (token: string): Promise<Idea[]> => {
  return await axios
    .get(`${IDEAS_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const fetchIdeas = async (token: string) => {
  const ideas = await getAdminIdeas(token)
  return ideas
}

const deleteInitiatorIdeas = async (id: number, token: string) => {
  return await axios
    .delete(`${IDEAS_URL}/initiator/delete/` + id, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => console.log(response.data))
    .catch((error) => console.warn(error))
}

const deleteAdminIdeas = async (id: number) => {
  return await axios
    .delete(`${IDEAS_URL}/admin/delete/` + id)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const putInitiatorIdeas = async (
  idea: Idea,
  id: number,
  token: string,
): Promise<Idea> => {
  return await axios
    .put(`${IDEAS_URL}/initiator/update/` + id, idea, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const putAdminIdeas = async (idea: Idea, id: number): Promise<Idea> => {
  return await axios
    .put(`${IDEAS_URL}/admin/update/` + id, idea)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const putProjectOfficeIdeas = async (
  status: string,
  id: number,
): Promise<Idea> => {
  return await axios
    .put(`${IDEAS_URL}/project-office/update` + id, status)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const putExpertIdeas = async (risk: Risk, id: number): Promise<Idea> => {
  return await axios
    .put(`${IDEAS_URL}/expert/update` + id, risk)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const IdeasService = {
  fetchIdeas,
  postInitiatorIdeas,
  getInitiatorIdeas,
  getAdminIdeas,
  deleteInitiatorIdeas,
  deleteAdminIdeas,
  putInitiatorIdeas,
  putAdminIdeas,
  putProjectOfficeIdeas,
  putExpertIdeas,
}

export default IdeasService
