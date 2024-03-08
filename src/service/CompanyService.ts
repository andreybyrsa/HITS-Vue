import { Company, Success, User } from '@Domain'
import { defineAxios, companiesMocks, usersMocks, TryCatch } from '@Utils'

const companiesDefineApi = defineAxios(companiesMocks)
const usersDefineApi = defineAxios(usersMocks)

const formatOwnerCompanies = (id: string, companies: Company[]) => {
  return companies.filter((company) => company.owner.id === id)
}

export class CompanyService {
  @TryCatch
  static async get(id: string): Promise<Company | Error> {
    const response = await companiesDefineApi.get(
      `/company/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async getAll(): Promise<Company[] | Error> {
    const response = await companiesDefineApi.get('/company/all')
    return response.data
  }

  @TryCatch
  static async getOwner(id: string): Promise<Company[] | Error> {
    const response = await companiesDefineApi.get<Company[]>(
      '/company/owner',
      {},
      { formatter: (companies) => formatOwnerCompanies(id, companies) },
    )
    return response.data
  }

  @TryCatch
  static async getStaff(id: string): Promise<User[] | Error> {
    const response = await usersDefineApi.get(`/company/staff/${id}`)
    return response.data
  }

  @TryCatch
  static async create(company: Company): Promise<Company | Error> {
    const response = await companiesDefineApi.post('/company/create', company)
    return response.data
  }

  @TryCatch
  static async update(company: Company, id: string): Promise<Success | Error> {
    const response = await companiesDefineApi.put<Success>(
      `/company/update/${id}`,
      company,
      {},
      { params: { id }, responseData: { success: 'Успешное обновление компании' } },
    )
    return response.data
  }

  @TryCatch
  static async remove(id: string): Promise<Success | Error> {
    const response = await companiesDefineApi.delete(
      `/company/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
