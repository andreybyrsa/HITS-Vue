<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import { NewPasswordModalProps } from '@Components/Modals/NewPasswordModal/NewPasswordModal.types'
import newPasswordModalInputs from '@Components/Modals/NewPasswordModal/NewPasswordModalInputs'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'

import { UpdateUserPassword } from '@Domain/ManageUsers'
import ResponseMessage from '@Domain/ResponseMessage'

import ManageUsersService from '@Services/ManageUsersService'

import Validation from '@Utils/Validation'

const props = defineProps<NewPasswordModalProps>()

const router = useRouter()
const response = reactive<ResponseMessage>({
  error: '',
})
const expiredTime = ref('')

const { setValues, handleSubmit } = useForm<UpdateUserPassword>({
  validationSchema: {
    key: (value: string) => value?.length,
    email: (value: string) => Validation.checkEmail(value),
    code: (value: string) => value?.length === 6 || 'Неверно введен код',
    password: (value: string) => Validation.checkPassword(value),
  },
})

watch(
  () => props.authKey,
  () => {
    const { authKey, email } = props
    setValues({ key: authKey, email })

    startTimer()
  },
)

function startTimer() {
  let initialSeconds = 300

  const intervalID = setInterval(() => {
    const minutes = Math.floor(initialSeconds / 60)
    const seconds = initialSeconds - minutes * 60

    const currentMinutes =
      minutes.toString().length > 1 ? minutes : `0${minutes}`
    const currentSeconds =
      seconds.toString().length > 1 ? seconds : `0${seconds}`

    expiredTime.value = `${currentMinutes}:${currentSeconds}`

    if (initialSeconds > 0) {
      initialSeconds--
    } else {
      clearInterval(intervalID)
    }
  }, 1000)
}

const handleUpdatePassword = handleSubmit(async (values) => {
  const { success, error } = await ManageUsersService.updateUserPassword(values)

  if (success) {
    router.push('/login')
  } else {
    response.error = error
  }
})
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div
      v-if="isOpened"
      class="new-password-modal p-3 rounded"
    >
      <Typography class-name="fs-3 text-primary">Новый пароль</Typography>

      <Input
        v-for="input in newPasswordModalInputs"
        :key="input.id"
        :name="input.name"
        :type="input.type"
        :placeholder="input.placeholder"
      >
        <template #prepend>
          <i :class="input.prepend"></i>
        </template>
      </Input>

      <Button
        class-name="btn-primary w-100"
        @click="handleUpdatePassword"
      >
        Изменить пароль
      </Button>

      <Typography
        v-if="response.error"
        class-name="text-danger fs-6"
      >
        {{ response.error }}
      </Typography>

      <Typography
        v-else
        class-name="text-primary fs-6 text-center"
      >
        Код отпрвлен на {{ email }}, время действия кода
        {{ expiredTime }}
      </Typography>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.new-password-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-end,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  @include flexible(center, flex-start, column, $gap: 16px);

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .new-password-modal,
.modal-layout-leave-to .new-password-modal {
  transform: scale(0.9);
}
</style>
