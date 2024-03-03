<script lang="ts" setup>
import { ref, onMounted, VueElement } from 'vue'
import { useFocusWithin } from '@vueuse/core'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import {
  FormInputsProps,
  FormInputsEmits,
} from '@Components/Forms/AddUsersForm/AddUsersForm.types'
import { HTMLTargetEvent } from '@Domain'
import { useNotificationsStore } from '@Store'
import { ManageUsersService } from '@Service'
import { validation } from '@Utils'

const notificationsStore = useNotificationsStore()

const fileInputRef = defineModel<VueElement | null>({
  required: true,
})
const props = defineProps<FormInputsProps>()
const emit = defineEmits<FormInputsEmits>()

const DBUsersEmails = ref<string[]>([])
const inputsWrapperRef = ref<VueElement | null>(null)
const { focused } = useFocusWithin(inputsWrapperRef)

const fileIsLoaded = ref(false)

onMounted(async () => {
  const response = await ManageUsersService.getUsersEmails()

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', 'Ошибка')
  }

  DBUsersEmails.value = response
})

const handleFileLoad = async (event: HTMLTargetEvent) => {
  const rawFile = event.target.files?.length && event.target.files[0]

  if (rawFile) {
    const fileURL = URL.createObjectURL(rawFile)
    await fetch(fileURL)
      .then((response) => response.text())
      .then((text) => {
        const emails = text.replace(/(\r\n|\r|\n)/g, ' ').split(' ')
        const validEmails = emails.reduce(
          (validAmount, email) =>
            validation.checkEmail(email) ? (validAmount += 1) : validAmount,
          0,
        )
        const notificationMessage = `Валидацию прошло ${validEmails} из ${emails.length}.`

        if (props.fileds[0].value === '') {
          emit('remove-email', 0)
        }
        emails.forEach((email) => emit('push-email', email))

        fileIsLoaded.value = true

        if (validEmails !== emails.length) {
          notificationsStore.createSystemNotification(
            'Система',
            notificationMessage + ' Некорректные почты добавлены на верх списка.',
          )
        } else {
          notificationsStore.createSystemNotification('Система', notificationMessage)
        }
      })
      .catch(({ response }) => {
        const error = response?.data?.error ?? 'Ошибка загрузки файла'
        notificationsStore.createSystemNotification('Система', error)
      })
  }
}

const moveErrorEmail = async (index: number) => {
  const prevEmail = props.fileds[index - 1]?.value

  if (
    index > 0 &&
    !focused.value &&
    validation.checkEmail(prevEmail) &&
    !DBUsersEmails.value.includes(prevEmail)
  ) {
    emit('move-email', index, 0)
  }
}

function getError(email: string, index: number) {
  if ((props.submitCount || fileIsLoaded.value) && !validation.checkEmail(email)) {
    moveErrorEmail(index)
    return 'Неверно введена почта'
  }
  if (
    (props.submitCount || fileIsLoaded.value) &&
    DBUsersEmails.value.includes(email)
  ) {
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
        variant="close"
        class-name="mt-2"
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
