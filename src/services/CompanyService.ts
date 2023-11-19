import Company from '@Domain/Company'
import Success from '@Domain/ResponseMessage'
import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const companiesAxios = defineAxios(getMocks().companies)
const usersAxios = defineAxios(getMocks().users)

function formatOwnerCompanies(owenId: string, companies: Company[]) {
  return companies.filter((company) => company.owner.id === owenId)
}

const getCompanies = async (token: string): Promise<Company[] | Error> => {
  return await companiesAxios
    .get('/company/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компаний'
      return new Error(error)
    })
}

const getOwnerCompanies = async (
  id: string,
  token: string,
): Promise<Company[] | Error> => {
  return await companiesAxios
    .get<Company[]>(
      '/company/owner',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (companies) => formatOwnerCompanies(id, companies) },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компаний'
      return new Error(error)
    })
}

const getCompany = async (id: string, token: string): Promise<Company | Error> => {
  return await companiesAxios
    .get(
      `/company/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компании'
      return new Error(error)
    })
}

const getCompanyMembers = async (token: string): Promise<User[] | Error> => {
  return await usersAxios
    .get('/users/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const createCompany = async (
  company: Company,
  token: string,
): Promise<Company | Error> => {
  return await companiesAxios
    .post('/company/create', company, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания компании'
      return new Error(error)
    })
}

const updateCompany = async (
  company: Company,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await companiesAxios
    .put<Success>(
      `/company/update/${id}`,
      company,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное обновление компании' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления компании'
      return new Error(error)
    })
}

const deleteCompany = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await companiesAxios
    .delete(
      `/company/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления компании'
      return new Error(error)
    })
}

const TeamService = {
  getCompanies,
  getOwnerCompanies,
  getCompany,
  getCompanyMembers,

  createCompany,

  updateCompany,

  deleteCompany,
}

export default TeamService
