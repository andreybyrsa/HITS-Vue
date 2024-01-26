<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="add-tag-modal p-3 rounded-3">
      <div class="add-tag-modal__header w-100">
        <Typography class-name="fs-4 text-primary">
          {{ tagModalMode === 'CREATE' ? 'Создать тег' : 'Редактировать тег' }}
        </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <div class="add-tag-modal__inputs w-100">
        <Input
          name="name"
          class-name="rounded-end"
          label="Название тега"
          placeholder="Введите название тега"
          validate-on-update
        />

        <Input
          name="color"
          type="color"
          class-name="form-control form-control-color"
          label="Цвет тега"
          title="Выберите цвет тега"
          validate-on-update
        />

        <Button
          v-if="tagModalMode === 'CREATE'"
          type="submit"
          variant="primary"
          :is-loading="isCreating"
          @click="handleCreateTag"
        >
          Создать
        </Button>
        <Button
          v-if="tagModalMode === 'UPDATE'"
          type="submit"
          variant="primary"
          :is-loading="isUpdating"
          @click="handleUpdateTag"
        >
          Сохранить
        </Button>
      </div>
    </div>
  </ModalLayout>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import {
  TagModalProps,
  TagModalEmits,
} from '@Components/Modals/TagModal/TagModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Tag } from '@Domain/Tag'

import TagsService from '@Services/TagsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const tags = defineModel<Tag[]>({ required: true })
const props = defineProps<TagModalProps>()
const emit = defineEmits<TagModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const tagModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

const isCreating = ref(false)
const isUpdating = ref(false)

const { handleSubmit, setValues } = useForm<Tag>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Неверно введено название тега',
    color: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Неверно выбран цвет тега',
  },
  initialValues: {
    confirmed: true,
  },
})

onUpdated(async () => {
  if (props.isOpened && props.tag) {
    tagModalMode.value = 'UPDATE'
    setValues({ ...props.tag })
  } else if (props.isOpened && !props.tag) {
    tagModalMode.value = 'CREATE'
  }
})

const handleCreateTag = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isCreating.value = true
    const response = await TagsService.createTag(values, token)
    isCreating.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    tags.value.push(response)
    emit('close-modal')
  }
})

const handleUpdateTag = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isUpdating.value = true
    const response = await TagsService.updateTag(values, values.id, token)
    isUpdating.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const tagIndex = tags.value.findIndex((tag) => tag.id === values.id)
    if (tagIndex !== -1) {
      tags.value.splice(tagIndex, 1, values)
    }

    emit('close-modal')
  }
})
</script>

<style scoped lang="scss">
.add-tag-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-end,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
  &__inputs {
    @include flexible(stretch, flex-start, column, $gap: 12px);
  }
}

.modal-layout-enter-from .add-tag-modal,
.modal-layout-leave-to .add-tag-modal {
  transform: scale(0.9);
}
</style>
