import axios from 'axios'

import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

const TEAM_URL = 'http://localhost:3000/api/v1/team'

const getTeams = async (token: string): Promise<Team[]> => {
  return await axios
    .get(`${TEAM_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команд'
      return new Error(error)
    })
}

const getTeam = async (id: string | string[], token: string): Promise<Team> => {
  return await axios
    .get(`${TEAM_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команды'
      return new Error(error)
    })
}

const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return await axios
    .post(`${TEAM_URL}/add`, team, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания команды'
      return new Error(error)
    })
}

const updateTeam = async (
  team: Team,
  id: string,
  token: string,
): Promise<Team | Error> => {
  return await axios
    .put(`${TEAM_URL}/update/${id}`, team, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления команды'
      return new Error(error)
    })
}

const deleteTeam = async (id: string, token: string): Promise<Success | Error> => {
  return await axios
    .delete(`${TEAM_URL}/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const TeamService = {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
}

export default TeamService
