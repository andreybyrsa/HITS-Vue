import axios from 'axios'

import { API_URL } from '@Main'

import { Tag } from '@Domain/Tag'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { tagsMocks } from '@Utils/getMocks'

const tagsAxios = defineAxios(tagsMocks)

const getAllTags = async (token: string): Promise<Tag[] | Error> => {
  return tagsAxios
    .get('/tags/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компетенций'))
}

const TagsService = {
  getAllTags,
}

export default TagsService
