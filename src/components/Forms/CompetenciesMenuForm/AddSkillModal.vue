<script lang="ts" setup>
import {
  AddSkillModalProps,
  AddSkillModalEmits,
} from '@Components/Forms/CompetenciesMenuForm/AddSkillModal.types'
import { Skill, SkillType } from '@Domain/Skill'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Validation from '@Utils/Validation'

import useUserStore from '@Store/user/userStore'
import SkillsService from '@Services/SkillService'
import useNotification from '@Hooks/useNotification'

const currentSkillId = ref('')

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

const { handleSubmit, setValues } = useForm<Skill>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkName(value) || 'Неверно введено название компетенции',
    type: (value: SkillType) =>
      Validation.checkName(value) || 'Неверно выбран тип компетенции',
  },
})

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const skills = defineModel<Skill[]>({ required: true })

const handleAddSkill = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.addSkill(values, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    skills.value.push(response)
    emit('close-modal')
  }
})

watch(
  () => props.currentId,
  (id) => {
    if (id && props.status == 'EDIT') {
      const currentSkill = skills.value.find((skill) => skill.id === id)
      if (currentSkill) {
        setValues({ ...currentSkill })
      }
    }
  },
)
const handleUpdateSkill = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.currentId) {
    const { token } = currentUser
    const response = await SkillsService.updateSkill(values, props.currentId, token)
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    const skillIndex = skills.value.findIndex((skill) => skill.id === values.id)
    if (skillIndex !== -1) {
      skills.value.splice(skillIndex, 1, response)
    }

    emit('close-modal')
  }
})
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
          class-name="fs-4 text-primary "
          >Редактировать компетенцию</Typography
        >

        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <div class="add-skill-modal__inputs w-100">
        <Input
          name="name"
          class-name="rounded-end"
          placeholder="Введите название компетенции"
          label="Название компетенции"
        />

        <Select
          name="type"
          :options="SkillTypeOptions"
          label="Тип компетенции*"
          placeholder="Выберите тип компетенции"
        ></Select>

        <Button
          v-if="props.status == 'ADD'"
          type="submit"
          class-name="btn-primary w-100"
          @click="handleAddSkill"
        >
          Сохранить
        </Button>
        <Button
          v-if="props.status == 'EDIT'"
          type="submit"
          class-name="btn-primary w-100"
          @click="handleUpdateSkill"
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
