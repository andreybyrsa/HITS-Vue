import { Success, Idea, IdeaStatusType, IdeaSkills } from '@Domain'
import { TryCatch, defineAxios, ideasMocks, ideasSkillsMocks } from '@Utils'

const ideasDefineApi = defineAxios(ideasMocks)
const ideaSkillsDefineApi = defineAxios(ideasSkillsMocks)

export class IdeaService {
  @TryCatch
  static async get(id: string): Promise<Idea | Error> {
    const response = await ideasDefineApi.get(`/idea/${id}`, {}, { params: { id } })
    return response.data
  }

  @TryCatch
  static async getAll(): Promise<Idea[] | Error> {
    const response = await ideasDefineApi.get('/idea/all')
    return response.data
  }

  @TryCatch
  static async getAllOnConfirmation(): Promise<Idea[] | Error> {
    const response = await ideasDefineApi.get('/idea/all/on-confirmation')
    return response.data
  }

  @TryCatch
  static async getAllInitiator(): Promise<Idea[] | Error> {
    const response = await ideasDefineApi.get('/idea/initiator/all')
    return response.data
  }

  @TryCatch
  static async getInitiator(id: string): Promise<Idea | Error> {
    const response = await ideasDefineApi.get(
      `/idea/initiator/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async getSkills(id: string): Promise<IdeaSkills[] | Error> {
    const response = await ideaSkillsDefineApi.get(`/idea/skills/${id}`, {
      params: { id },
    })
    return response.data
  }

  @TryCatch
  static async create(idea: Idea): Promise<Idea | Error> {
    const response = await ideasDefineApi.post('/idea/add', idea)
    return response.data
  }

  @TryCatch
  static async createSkills(skills: IdeaSkills): Promise<IdeaSkills | Error> {
    const response = await ideaSkillsDefineApi.post('/idea/skills/add', skills)
    return response.data
  }

  @TryCatch
  static async createDraft(idea: Idea): Promise<Idea | Error> {
    const response = await ideasDefineApi.post('/idea/draft/add', idea)
    return response.data
  }

  @TryCatch
  static async update(idea: Idea, id: string): Promise<Success | Error> {
    const response = await ideasDefineApi.put<Success>(
      `/idea/initiator/update/${id}`,
      idea,
      {},
      { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
    )
    return response.data
  }

  @TryCatch
  static async updateByAdmin(idea: Idea, id: string): Promise<Success | Error> {
    const response = await ideasDefineApi.put<Success>(
      `/idea/admin/update/${id}`,
      idea,
      {},
      { params: { id }, responseData: { success: 'Успешное обновление идеи' } },
    )
    return response.data
  }

  @TryCatch
  static async updateSkills(
    ideaId: string,
    ideaSkills: IdeaSkills,
  ): Promise<IdeaSkills | Error> {
    const response = await ideaSkillsDefineApi.put(
      '/idea/skills/update',
      ideaSkills,
      {},
      { params: { ideaId } },
    )
    return response.data
  }

  @TryCatch
  static async check(id: string): Promise<void | Error> {
    const response = await ideasDefineApi.putNoRequestBody<void>(
      `/idea/check/${id}`,
      {},
      { params: { id }, requestData: { isChecked: true } },
    )
    return response.data
  }

  @TryCatch
  static async send(id: string, status: IdeaStatusType): Promise<Success | Error> {
    const response = await ideasDefineApi.putNoRequestBody<Success>(
      `/idea/initiator/send/${id}`,
      {},
      {
        params: { id },
        requestData: { status },
        responseData: { success: 'Успешная отправка идеи' },
      },
    )
    return response.data
  }

  @TryCatch
  static async updateStatus(
    id: string,
    status: IdeaStatusType,
  ): Promise<Success | Error> {
    const response = await ideasDefineApi.put<Success>(
      `/idea/status/update/${id}`,
      { status: status },
      {},
      { params: { id }, responseData: { success: 'Статус идеи изменен' } },
    )
    return response.data
  }

  @TryCatch
  static async remove(id: string): Promise<Success | Error> {
    const response = await ideasDefineApi.delete(
      `/idea/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async removeByAdmin(id: string): Promise<Success | Error> {
    const response = await ideasDefineApi.delete(
      `/idea/admin/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
