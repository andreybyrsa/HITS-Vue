<script lang="ts" setup>
import { ref, onMounted, VueElement } from 'vue'
import { useFocusWithin } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import {
  FormInputsProps,
  FormInputsEmits,
} from '@Components/Forms/AddUsersForm/AddUsersForm.types'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'

import Validation from '@Utils/Validation'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()

const fileInputRef = defineModel<VueElement | null>({
  required: true,
})
const props = defineProps<FormInputsProps>()
const emit = defineEmits<FormInputsEmits>()

const userSotre = useUserStore()
const { user } = storeToRefs(userSotre)

const DBUsersEmails = ref<string[]>([])
const inputsWrapperRef = ref<VueElement | null>(null)
const { focused } = useFocusWithin(inputsWrapperRef)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.getUsersEmails(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', 'Ошибка')
    }

    DBUsersEmails.value = response
  }
})

const handleFileLoad = async (event: HTMLTargetEvent) => {
  const rawFile = event.target.files?.length && event.target.files[0]

  if (rawFile) {
    const fileURL = URL.createObjectURL(rawFile)

    await fetch(fileURL)
      .then((response) => response.text())
      .then((text) => {
        const regExpPattern = /[a-zA-Z_.-{0,9}]+@[a-zA-Z_]+\.[a-zA-Z]{2,10}/gm
        const emails = text.split('\n')

        const formattedEmails = text.match(regExpPattern) ?? []
        if (formattedEmails) {
          formattedEmails.forEach((email) => emit('push-email', email))
        }

        notificationsStore.createSystemNotification(
          'Система',
          'Файл успешно загружен',
        )
      })
      .catch(({ response }) => {
        const error = response?.data?.error ?? 'Ошибка загрузки файла'
        notificationsStore.createSystemNotification('Система', response.message)
      })
  }
}

const moveErrorEmail = async (index: number) => {
  const prevEmail = props.fileds[index - 1]?.value

  if (
    index > 0 &&
    !focused.value &&
    Validation.checkEmail(prevEmail) &&
    !DBUsersEmails.value.includes(prevEmail)
  ) {
    emit('move-email', index, 0)
  }
}

function getError(email: string, index: number) {
  if (props.submitCount && !Validation.checkEmail(email)) {
    moveErrorEmail(index)
    return 'Неверно введена почта'
  }
  if (props.submitCount && DBUsersEmails.value.includes(email)) {
    moveErrorEmail(index)
    return 'Почта уже зарегистрирована'
  }
  return undefined
}
</script>

<template>
  <div
    ref="inputsWrapperRef"
    class="form-inputs w-100 p-1"
  >
    <div
      v-for="(field, index) in fileds"
      :key="index"
      class="form-inputs__field"
    >
      <Input
        type="email"
        :name="`emails[${index}]`"
        class-name="rounded-end"
        :error="getError(field.value, index)"
        placeholder="Введите email"
        prepend="@"
      />

      <Button
        v-if="fileds.length > 1"
        class-name="btn-close mt-2"
        @click="emit('remove-email', index)"
      ></Button>
    </div>
  </div>

  <input
    type="file"
    ref="fileInputRef"
    @change="(event) => handleFileLoad(event as HTMLTargetEvent)"
    hidden
  />
</template>

<style lang="scss" scoped>
.form-inputs {
  max-height: 250px;

  overflow-y: scroll;

  @include flexible(stretch, flex-start, column, $gap: 8px);

  &__field {
    @include flexible(flex-start, flex-start, $gap: 8px);
  }
}
</style>
