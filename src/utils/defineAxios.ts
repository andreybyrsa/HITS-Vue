import { Ref, ref } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { MODE, API_URL } from '@Main'

import Success from '@Domain/ResponseMessage'

type OptionalMocksDataType<MocksType> = Partial<
  Record<keyof MocksType, MocksType[keyof MocksType]>
>

interface AxiosMockConfig<RequestMocksType, ResponseMocksType = unknown> {
  params?: OptionalMocksDataType<RequestMocksType>
  requestData?: OptionalMocksDataType<RequestMocksType>
  responseData?: ResponseMocksType
  formatter?: (data: RequestMocksType[]) => ResponseMocksType
}

function getMockConfigParams<MocksType>(mockConfig: AxiosMockConfig<MocksType>) {
  const key = Object.keys(mockConfig.params ?? {})[0] as keyof MocksType
  const value = mockConfig.params?.[key] as MocksType[keyof MocksType]

  return { key, value }
}

function createMockResponse<MockResponseType>(
  data: MockResponseType,
): AxiosResponse<MockResponseType> {
  return {
    data,
    status: 200,
    statusText: 'OK',
  } as AxiosResponse<MockResponseType>
}

function defineAxios<MocksType>(mocks: MocksType[]) {
  const mockArray = ref(mocks) as Ref<MocksType[]>

  async function get(
    endPoint: string,
    config?: AxiosRequestConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType[]>>
  async function get(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  async function get<ResponseType>(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  async function get<ResponseType>(
    endPoint: string,
    config?: AxiosRequestConfig<MocksType>,
    mockConfig?: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<MocksType | ResponseType | MocksType[]>> {
    if (MODE === 'PRODUCTION') {
      return axios.get(`${API_URL}${endPoint}`, config)
    }

    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (mockConfig?.params) {
          const { key, value } = getMockConfigParams(mockConfig)
          const currentMockData = mockArray.value.find((mock) => mock[key] === value)

          if (currentMockData) {
            resolve(createMockResponse(structuredClone(currentMockData)))
          } else {
            reject(createMockResponse('Искомые данные не найдены'))
          }
        } else {
          const copiedMockArray = structuredClone(mockArray.value)

          if (mockConfig?.formatter) {
            resolve(createMockResponse(mockConfig.formatter(copiedMockArray)))
          } else {
            resolve(createMockResponse(copiedMockArray))
          }
        }
      }, 500),
    )
  }

  async function post(
    endPoint: string,
    mockData: MocksType,
    config?: AxiosRequestConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  async function post<ResponseType>(
    endPoint: string,
    mockData: MocksType,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  async function post<ResponseType>(
    endPoint: string,
    mockData: MocksType,
    config?: AxiosRequestConfig<MocksType>,
    mockConfig?: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<MocksType | ResponseType>> {
    if (MODE === 'PRODUCTION') {
      return axios.post(`${API_URL}${endPoint}`, mockData, config)
    }

    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const id = Math.random() * 100000000
        const data = { ...mockData, id } as MocksType
        mockArray.value.push(data)

        if (mockConfig) {
          const { responseData } = mockConfig

          if (responseData) {
            resolve(createMockResponse(responseData))
          } else {
            reject(createMockResponse('Ошибка возврата данных'))
          }
        } else {
          resolve(createMockResponse(data))
        }
      }, 500),
    )
  }

  async function put(
    endPoint: string,
    newMockData: MocksType | OptionalMocksDataType<MocksType>,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  async function put<ResponseType>(
    endPoint: string,
    newMockData: MocksType | OptionalMocksDataType<MocksType>,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  async function put<ResponseType>(
    endPoint: string,
    newMockData: MocksType | OptionalMocksDataType<MocksType>,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<MocksType | ResponseType>> {
    if (MODE === 'PRODUCTION') {
      return axios.put(`${API_URL}${endPoint}`, newMockData, config)
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockConfig.params) {
          const { key, value } = getMockConfigParams(mockConfig)
          const currentMockDataIndex = mockArray.value.findIndex(
            (mock) => mock[key] === value,
          )

          if (currentMockDataIndex !== -1) {
            const currentMockData = mockArray.value[currentMockDataIndex]
            const { requestData } = mockConfig

            mockArray.value[currentMockDataIndex] = {
              ...currentMockData,
              ...newMockData,
              ...(requestData ?? {}),
            }

            const { responseData } = mockConfig
            if (responseData) {
              resolve(createMockResponse(responseData))
            } else {
              resolve(
                createMockResponse(
                  structuredClone(mockArray.value[currentMockDataIndex]),
                ),
              )
            }
          } else {
            reject(createMockResponse('Искомые данные не найдены'))
          }
        } else {
          reject(createMockResponse('Искомые данные не найдены'))
        }
      }, 500)
    })
  }

  async function putNoRequestBody<ResponseType>(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  async function putNoRequestBody<ResponseType>(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType | void>> {
    if (MODE === 'PRODUCTION') {
      return axios.put(`${API_URL}${endPoint}`, null, config)
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockConfig.params) {
          const { key, value } = getMockConfigParams(mockConfig)
          const { requestData } = mockConfig
          const currentMockDataIndex = mockArray.value.findIndex(
            (mock) => mock[key] === value,
          )

          if (currentMockDataIndex !== -1 && requestData) {
            const currentMockData = mockArray.value[currentMockDataIndex]
            mockArray.value[currentMockDataIndex] = {
              ...currentMockData,
              ...requestData,
            }

            const { responseData } = mockConfig
            resolve(createMockResponse(responseData))
          } else {
            reject(createMockResponse('Искомые данные не найдены'))
          }
        } else {
          reject(createMockResponse('Искомые данные не найдены'))
        }
      }, 500)
    })
  }

  async function deleteData(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<Success>> {
    if (MODE === 'PRODUCTION') {
      return axios.delete(`${API_URL}${endPoint}`, config)
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockConfig.params) {
          const { key, value } = getMockConfigParams(mockConfig)
          const currentMockIndex = mockArray.value.findIndex(
            (mock) => mock[key] === value,
          )

          if (currentMockIndex !== -1) {
            mockArray.value.splice(currentMockIndex, 1)
            resolve(createMockResponse({ success: 'Успешное удаление' }))
          } else {
            reject(createMockResponse('Искомые данные не найдены'))
          }
        } else {
          reject(createMockResponse('Искомые данные не найдены'))
        }
      }, 500)
    })
  }

  return { get, post, put, putNoRequestBody, delete: deleteData }
}

export default defineAxios