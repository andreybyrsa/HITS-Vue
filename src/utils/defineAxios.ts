import { Ref, ref } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { MODE, API_URL } from '@Main'

import Success from '@Domain/ResponseMessage'

type OptionalMocksDataType<MocksType> = Partial<
  Record<keyof MocksType, MocksType[keyof MocksType]>
>

interface AxiosMockConfig<RequestMocksType, ResponseMocksType = unknown> {
  params?: OptionalMocksDataType<RequestMocksType>
  comparingKey?: keyof RequestMocksType
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

  function get(
    endPoint: string,
    config?: AxiosRequestConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType[]>>
  function get(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  function get<ResponseType>(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  function get<ResponseType>(
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

  function post(
    endPoint: string,
    mockData: MocksType,
    config?: AxiosRequestConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  function post(
    endPoint: string,
    mockData: MocksType[],
    config?: AxiosRequestConfig<MocksType[]>,
  ): Promise<AxiosResponse<MocksType[]>>
  function post<ResponseType>(
    endPoint: string,
    mockData: MocksType,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  function post<ResponseType>(
    endPoint: string,
    mockData: MocksType | MocksType[],
    config?: AxiosRequestConfig<MocksType | MocksType[]>,
    mockConfig?: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<MocksType | MocksType[] | ResponseType>> {
    if (MODE === 'PRODUCTION') {
      return axios.post(`${API_URL}${endPoint}`, mockData, config)
    }

    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (mockData instanceof Array) {
          const values: MocksType[] = []
          mockData.forEach((value) => {
            const id = (Math.random() * 100000000).toString()
            const data = { ...value, id } as MocksType
            values.push(data)
            mockArray.value.push(data)
          })

          if (mockConfig) {
            const { responseData } = mockConfig

            if (responseData) {
              resolve(createMockResponse(responseData))
            } else {
              reject(createMockResponse('Ошибка возврата данных'))
            }
          } else {
            resolve(createMockResponse(values))
          }
        } else {
          const id = (Math.random() * 100000000).toString()
          const requestData = mockConfig?.requestData
          const data = {
            ...mockData,
            ...(requestData ?? {}),
            id,
          } as MocksType
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
        }
      }, 500),
    )
  }

  function postNoRequestBody<ResponseType>(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType | MocksType>> {
    if (MODE === 'PRODUCTION') {
      return axios.post(`${API_URL}${endPoint}`, null, config)
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const requestData = mockConfig.requestData
        const responseData = mockConfig.responseData

        if (requestData) {
          const id = (Math.random() * 100000000).toString()
          const data = {
            ...({} as MocksType),
            ...requestData,
            id,
          } as MocksType
          mockArray.value.push(data)

          if (responseData) {
            resolve(createMockResponse(responseData))
          } else {
            resolve(createMockResponse(data))
          }
        }
      }, 500)
    })
  }

  function put(
    endPoint: string,
    newMockData: MocksType[],
    config: AxiosRequestConfig<MocksType[]>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType[]>>
  function put(
    endPoint: string,
    newMockData: MocksType | OptionalMocksDataType<MocksType>,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  function put<ResponseType>(
    endPoint: string,
    newMockData: MocksType | OptionalMocksDataType<MocksType>,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  function put<ResponseType>(
    endPoint: string,
    newMockData: MocksType | MocksType[] | OptionalMocksDataType<MocksType>,
    config: AxiosRequestConfig<MocksType | MocksType[]>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<MocksType | MocksType[] | ResponseType>> {
    if (MODE === 'PRODUCTION') {
      return axios.put(`${API_URL}${endPoint}`, newMockData, config)
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (newMockData instanceof Array) {
          if (mockConfig.comparingKey) {
            const comparingKey = mockConfig.comparingKey
            const responseMockData: MocksType[] = []

            newMockData.forEach((value) => {
              const currentMockIndex = mockArray.value.findIndex(
                (mockValue) => mockValue[comparingKey] === value[comparingKey],
              )

              if (currentMockIndex !== -1) {
                const currentMockValue = mockArray.value[currentMockIndex]
                const newMockValue = {
                  ...currentMockValue,
                  ...value,
                }
                responseMockData.push(newMockValue)

                mockArray.value[currentMockIndex] = newMockValue
              } else {
                reject(createMockResponse('Искомые данные не найдены'))
              }
            })

            resolve(createMockResponse(structuredClone(responseMockData)))
          } else {
            reject(createMockResponse('Искомые данные не найдены'))
          }
        } else {
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
        }
      }, 500)
    })
  }

  function putNoRequestBody<ResponseType>(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType, ResponseType>,
  ): Promise<AxiosResponse<ResponseType>>
  function putNoRequestBody<ResponseType>(
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

  function deleteData(
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

  function getReactiveMocks() {
    return mockArray
  }

  return {
    get,
    getReactiveMocks,

    post,
    postNoRequestBody,

    put,
    putNoRequestBody,

    delete: deleteData,
  }
}

export default defineAxios
