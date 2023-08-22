<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import { NewEmailModalProps } from '@Components/Modals/NewEmailModal/NewEmailModal.types'
import newEmailModalInputs from '@Components/Modals/NewEmailModal/NewEmailModalInputs'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import ManageUsersService from '@Services/ManageUsersService'
import Validation from '@Utils/Validation'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import { NewEmailForm } from '@Domain/Invitation'
import InvitationService from '@Services/InvitationService'
import useNotification from '@Hooks/useNotification'

const route = useRoute()
const { slug } = route.params
const expiredTime = ref('')
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const response = reactive({
  success: '',
  key: '',
  error: '',
})
const { handleOpenNotification } = useNotification()
const props = defineProps<NewEmailModalProps>()
const router = useRouter()
const { setValues, handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    oldEmail: (value: string) => Validation.checkEmail(value),
    code: (value: string) => value?.length === 6 || 'Неверно введен код',
    newEmail: (value: string) => Validation.checkEmail(value),
    url: (value: string) => value?.length,
  },
  initialValues: { oldEmail: user.value?.email, url: slug },
})

watch(
  () => props.authKey,
  () => {
    const { authKey } = props
    setValues({ key: authKey })

    startTimer()
  },
)

function startTimer() {
  let initialSeconds = 300

  const intervalID = setInterval(() => {
    const minutes = Math.floor(initialSeconds / 60)
    const seconds = initialSeconds - minutes * 60
    const currentMinutes = minutes.toString().length > 1 ? minutes : `0${minutes}`
    const currentSeconds = seconds.toString().length > 1 ? seconds : `0${seconds}`

    expiredTime.value = `${currentMinutes}:${currentSeconds}`

    if (initialSeconds > 0) {
      initialSeconds
    } else {
      clearInterval(intervalID)
    }
  }, 1000)
}

onMounted(async () => {
  const { slug } = route.params
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await InvitationService.sendNewCode(slug, token)
    startTimer()
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    setValues({ ...response })
  }
})

const handleChangeEmail = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.updateUserEmail(
      values as unknown as NewEmailForm,
      token,
    )
    if (response instanceof Error) {
      handleOpenNotification('error', response.message)
    }
    router.push('/login')
  }
})
</script>

<template>
  <ModalLayout :is-opened="true">
    <div
      v-if="true"
      class="new-email-modal p-3 rounded"
    >
      <Typography class-name="fs-3 text-primary">Новая почта</Typography>

      <Input
        v-for="input in newEmailModalInputs"
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
        @click="handleChangeEmail"
      >
        Подтвердить
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
        Код отправлен на почту, время действия кода:
        {{ expiredTime }}
      </Typography>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.new-email-modal {
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

.modal-layout-enter-from .new-email-modal,
.modal-layout-leave-to .new-email-modal {
  transform: scale(0.9);
}
</style>
