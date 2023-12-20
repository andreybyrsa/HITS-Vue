<script setup lang="ts" generic="FormType">
import { useForm } from 'vee-validate'
import { string } from 'yup'

import Typography from '@Components/Typography/Typography.vue'
import { AdvertisementsFormProps } from '@Components/Forms/AdvertisementsForm/AdvertisementsForm.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

const props = defineProps<AdvertisementsFormProps<FormType>>()

const { handleSubmit, resetForm } = useForm<FormType>({
  validationSchema: {
    text: string().required('Поле обязательно к заполнению'),
  },
  initialValues: {
    ...props.initialState,
  },
})

const handleSendAdvertisement = handleSubmit(async (values) => {
  await props.handleSendAdvertisement(values)

  resetForm()
})
</script>

<template>
  <div class="bg-white rounded-3">
    <div class="py-2 w-100 border-bottom">
      <Typography class-name="px-3">{{ title }}</Typography>
    </div>

    <div class="d-grid gap-3 pt-3 px-3 w-100">
      <slot name="content"></slot>
    </div>

    <form
      v-if="hasAccessToSend"
      class="p-3"
    >
      <div class="d-flex gap-3 align-items-start">
        <Input
          name="text"
          class-name="rounded-end"
          :placeholder="inputPlaceholder"
          validate-on-update
        >
          <template #prepend>
            <i class="bi bi-chat"></i>
          </template>
        </Input>

        <Button
          type="submit"
          variant="primary"
          @click="handleSendAdvertisement"
        >
          Отправить
        </Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.current-user-comment {
  justify-self: end;
}
</style>
