import Company from '@Domain/Company'
import Success from '@Domain/ResponseMessage'
import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { companiesMocks, usersMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const companiesAxios = defineAxios(companiesMocks)
const usersAxios = defineAxios(usersMocks)

function formatOwnerCompanies(owenId: string, companies: Company[]) {
  return companies.filter((company) => company.owner.id === owenId)
}

const getCompanies = async (token: string): Promise<Company[] | Error> => {
  return companiesAxios
    .get('/api/v1/ideas-service/company/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компаний'))
}

const getOwnerCompanies = async (
  id: string,
  token: string,
): Promise<Company[] | Error> => {
  return companiesAxios
    .get<Company[]>(
      '/api/v1/ideas-service/company/owner',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (companies) => formatOwnerCompanies(id, companies) },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компаний'))
}

const getCompany = async (id: string, token: string): Promise<Company | Error> => {
  return companiesAxios
    .get(
      `/api/v1/ideas-service/company/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компании'))
}

const getCompanyStaff = async (
  id: string,
  token: string,
): Promise<User[] | Error> => {
  return usersAxios
    .get(`/api/v1/ideas-service/company/staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения контактных лиц'))
}

const createCompany = async (
  company: Company,
  token: string,
): Promise<Company | Error> => {
  return companiesAxios
    .post('/api/v1/ideas-service/company/create', company, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания компании'))
}

const updateCompany = async (
  company: Company,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return companiesAxios
    .put<Success>(
      `/api/v1/ideas-service/company/update/${id}`,
      company,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное обновление компании' } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления компании'))
}

const deleteCompany = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return companiesAxios
    .delete(
      `/api/v1/ideas-service/company/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления компании'))
}

const CompanyService = {
  getCompanies,
  getOwnerCompanies,
  getCompany,
  getCompanyStaff,

  createCompany,

  updateCompany,

  deleteCompany,
}

export default CompanyService
