import { Ref, ref } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { MODE, API_URL } from '@Main'

import Success from '@Domain/ResponseMessage'

interface AxiosMockConfig<MocksType> {
  params: Partial<Record<keyof MocksType, MocksType[keyof MocksType]>>
}

function getMockConfigParams<MocksType>(mockConfig: AxiosMockConfig<MocksType>) {
  const key = Object.keys(mockConfig.params)[0] as keyof MocksType
  const value = mockConfig.params[key]

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

function createAxios<MocksType>(name: string, mocks: MocksType[]) {
  const mockArray = ref(mocks) as Ref<MocksType[]>

  async function get(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType[]>>
  async function get(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>>
  async function get(
    endPoint: string,
    config: AxiosRequestConfig<MocksType>,
    mockConfig?: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType | MocksType[]>> {
    if (MODE === 'PRODUCTION') {
      return axios.get(`${API_URL}${endPoint}`, config)
    }

    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (mockConfig) {
          const { key, value } = getMockConfigParams(mockConfig)
          const currentMockData = mockArray.value.find((mock) => mock[key] === value)

          if (currentMockData) {
            resolve(createMockResponse(currentMockData))
          } else {
            reject(createMockResponse('Искомые данные не найдены'))
          }
        } else {
          const copiedMockArray = mockArray.value.map((mock) =>
            structuredClone(mock),
          )
          resolve(createMockResponse(copiedMockArray))
        }
      }, 500),
    )
  }

  async function post(
    endPoint: string,
    mockData: MocksType,
    config: AxiosRequestConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>> {
    if (MODE === 'PRODUCTION') {
      return axios.post(`${API_URL}${endPoint}`, mockData, config)
    }

    return new Promise((resolve) =>
      setTimeout(() => {
        const id = (Math.random() * 100000000).toString()
        const data = { ...mockData, id } as MocksType
        mockArray.value.push(data)

        resolve(createMockResponse(data))
      }, 500),
    )
  }

  async function put(
    endPoint: string,
    newMockData: MocksType,
    config: AxiosRequestConfig<MocksType>,
    mockConfig: AxiosMockConfig<MocksType>,
  ): Promise<AxiosResponse<MocksType>> {
    if (MODE === 'PRODUCTION') {
      return axios.put(`${API_URL}${endPoint}`, newMockData, config)
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { key, value } = getMockConfigParams(mockConfig)
        const currentMockDataIndex = mockArray.value.findIndex(
          (mock) => mock[key] === value,
        )

        if (currentMockDataIndex !== -1) {
          const currentMockData = mockArray.value[currentMockDataIndex]
          mockArray.value[currentMockDataIndex] = {
            ...currentMockData,
            ...newMockData,
          }

          resolve(createMockResponse(structuredClone(currentMockData)))
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
      }, 500)
    })
  }

  return { get, post, put, delete: deleteData }
}

export default createAxios
