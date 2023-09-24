<script lang="ts" setup>
import {
  AddSkillModalProps,
  AddSkillModalEmits,
} from '@Components/Forms/CompetenciesMenuForm/AddSkillModal.types'
import { Skill, SkillType } from '@Domain/Skill'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Validation from '@Utils/Validation'

import useUserStore from '@Store/user/userStore'
import SkillsService from '@Services/SkillService'
import useNotification from '@Hooks/useNotification'

const SkillTypeOptions = [
  {
    value: 'LANGUAGE',
    label: 'Language',
  },
  {
    value: 'FRAMEWORK',
    label: 'Framework',
  },
  {
    value: 'DATABASE',
    label: 'Database',
  },
  {
    value: 'DEVOPS',
    label: 'Devops',
  },
]
const props = defineProps<AddSkillModalProps>()
const emit = defineEmits<AddSkillModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { handleSubmit } = useForm<Skill>({
  validationSchema: {
    SkillName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена почта',
    SkillType: (value: SkillType) =>
      Validation.checkName(value) || 'Неверно введено имя',
  },
})

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

// const handleAddSkill = handleSubmit(async (values) => {
//   const currentUser = user.value

//   if (currentUser?.token) {
//     const { token } = currentUser
//     const response = await SkillsService.addSkill(values, token)

//     if (response instanceof Error) {
//       return handleOpenNotification('error', response.message)
//     }

//     emit('save-user', values, response.success)
//     emit('close-modal')
//   }
// })

// const handleAddSkill = handleSubmit(async (values) => {
//   const currentUser = user.value

//   if (currentUser?.token) {
//     const { token } = currentUser
//     const response = await ManageUsersService.updateUserInfo(values, token)

//     if (response instanceof Error) {
//       return handleOpenNotification('error', response.message)
//     }

//     emit('save-user', values, response.success)
//     emit('close-modal')
//   }
// })
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="isOpened"
      class="add-skill-modal p-3 rounded-3"
    >
      <div class="add-skill-modal__header w-100">
        <Typography
          v-if="props.status === 'ADD'"
          class-name="fs-3 text-primary "
          >Создать компетенцию</Typography
        >

        <Typography
          v-if="props.status === 'EDIT'"
          class-name="fs-3 text-primary "
          >Редактировать компетенцию</Typography
        >

        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <div class="add-skill-modal__inputs w-100">
        <Input
          name="SkillName"
          validate-on-update
          class-name="rounded-end"
          placeholder="введите название компетенции"
          label="Название компетенции"
        ></Input>

        <Select
          name="SkillType"
          validate-on-update
          :options="SkillTypeOptions"
          label="Тип компетенции*"
          placeholder="Выберите тип компетенции"
        ></Select>

        <Button
          type="submit"
          class-name="btn-primary w-100"
          @click="handleAddSkill"
        >
          Сохранить
        </Button>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.add-skill-modal {
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
    @include flexible(center, flex-start, column, $gap: 12px);
  }
}
.modal-layout-enter-from .edit-user-modal,
.modal-layout-leave-to .edit-user-modal {
  transform: scale(0.9);
}
</style>
