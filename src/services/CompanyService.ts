import Company from '@Domain/Company'
import Success from '@Domain/ResponseMessage'
import { User } from '@Domain/User'
import defineAxios from '@Utils/defineAxios'
import { companiesMocks, usersMocks } from '@Utils/getMocks'

const companiesDefineApi = defineAxios(companiesMocks)
const usersDefineApi = defineAxios(usersMocks)

const formatOwnerCompanies = (id: string, companies: Company[]) => {
  return companies.filter((company) => company.owner.id === id)
}

const get = async (id: string): Promise<Company | Error> => {
  const response = await companiesDefineApi.get(
    `/company/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

const getAll = async (): Promise<Company[] | Error> => {
  const response = await companiesDefineApi.get('/company/all')
  return response.data
}

const getOwner = async (id: string): Promise<Company[] | Error> => {
  const response = await companiesDefineApi.get<Company[]>(
    '/company/owner',
    {},
    { formatter: (companies) => formatOwnerCompanies(id, companies) },
  )
  return response.data
}

const getStaff = async (id: string): Promise<User[] | Error> => {
  const response = await usersDefineApi.get(`/company/staff/${id}`)
  return response.data
}

const create = async (company: Company): Promise<Company | Error> => {
  const response = await companiesDefineApi.post('/company/create', company)
  return response.data
}

const update = async (company: Company, id: string): Promise<Success | Error> => {
  const response = await companiesDefineApi.put<Success>(
    `/company/update/${id}`,
    company,
    {},
    { params: { id }, responseData: { success: 'Успешное обновление компании' } },
  )
  return response.data
}

const remove = async (id: string): Promise<Success | Error> => {
  const response = await companiesDefineApi.delete(
    `/company/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

export const CompanyService = {
  get,
  getAll,
  getOwner,
  getStaff,
  create,
  update,
  remove,
}
