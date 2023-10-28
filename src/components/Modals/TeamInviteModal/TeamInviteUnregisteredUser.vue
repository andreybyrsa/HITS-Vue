<script lang="ts" setup>
import Validation from '@Utils/Validation'
import { useFieldArray, useForm } from 'vee-validate'
import { VueElement, ref } from 'vue'
import {
  TeamInviteUnregisteredUsersEmits,
  TeamInviteUnregisteredUsersForm,
} from '@Components/Modals/TeamInviteModal/TeamInviteModal.types'
import FormInputs from '@Components/Forms/AddUsersForm/FormInputs.vue'
import Button from '@Components/Button/Button.vue'

const emit = defineEmits<TeamInviteUnregisteredUsersEmits>()
const { resetForm, submitCount, handleSubmit } =
  useForm<TeamInviteUnregisteredUsersForm>({
    validationSchema: {
      emails: (value: string[]) =>
        value?.every((email) => Validation.checkEmail(email)),
    },
    initialValues: {
      emails: [''],
    },
  })

const { fields, push, move, remove } = useFieldArray<string>('emails')
const fileInputRef = ref<VueElement | null>(null)

const handleInviteFromOutside = handleSubmit(async (values) => {
  emit('inviteUnregisteredUsers', values.emails)
  resetForm()
})
</script>

<template>
  <div class="invite-unregistered h-100">
    <FormInputs
      :fileds="fields"
      :submit-count="submitCount"
      v-model="fileInputRef"
      @push-email="push"
      @move-email="move"
      @remove-email="remove"
    />

    <div>
      <div class="invite-unregistered__form-controller">
        <Button
          type="button"
          class-name="btn-primary w-50"
          prepend-icon-name="bi bi-plus-lg"
          @click="push('')"
        >
          Добавить почту
        </Button>

        <Button
          type="button"
          class-name="btn-primary w-50"
          prepend-icon-name="bi bi-file-earmark"
          @click="fileInputRef?.click()"
        >
          Загрузить файл
        </Button>
      </div>

      <Button
        type="submit"
        class-name="btn-primary w-100 mt-2"
        @click="handleInviteFromOutside"
      >
        Пригласить
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.invite-unregistered {
  @include flexible(stretch, space-between, column);

  &__form-controller {
    @include flexible(stretch, center, $gap: 16px);
  }
}
</style>
