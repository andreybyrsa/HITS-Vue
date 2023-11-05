<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import {
  SkillModalProps,
  SkillModalEmits,
} from '@Components/Modals/SkillModal/SkillModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Skill, SkillType } from '@Domain/Skill'

import SkillsService from '@Services/SkillsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import getSkills from '@Utils/getSkills'
import Validation from '@Utils/Validation'

const skills = defineModel<Skill[]>({ required: true })
const props = defineProps<SkillModalProps>()
const emit = defineEmits<SkillModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const skillModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

const availableSkills = getSkills()

const skillTypeOptions = availableSkills.skills.map((skillType) => ({
  value: skillType,
  label: availableSkills.translatedSkills[skillType],
}))

const { handleSubmit, setValues } = useForm<Skill>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Неверно введено название компетенции',
    type: (value: SkillType) =>
      Validation.checkIsEmptyValue(value) || 'Неверно выбран тип компетенции',
  },
  initialValues: {
    confirmed: true,
  },
})

onUpdated(async () => {
  if (props.isOpened && props.skill) {
    skillModalMode.value = 'UPDATE'
    setValues({ ...props.skill })
  } else if (props.isOpened && !props.skill) {
    skillModalMode.value = 'CREATE'
  }
})

const handleCreateSkill = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.createSkill(values, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    skills.value.push(response)
    emit('close-modal')
  }
})

const handleUpdateSkill = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.updateSkill(values, values.id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const skillIndex = skills.value.findIndex((skill) => skill.id === values.id)
    if (skillIndex !== -1) {
      skills.value.splice(skillIndex, 1, values)
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
    <div class="add-skill-modal p-3 rounded-3">
      <div class="add-skill-modal__header w-100">
        <Typography class-name="fs-4 text-primary">
          {{
            skillModalMode === 'CREATE'
              ? 'Создать компетенцию'
              : 'Редактировать компетенцию'
          }}
        </Typography>

        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <div class="add-skill-modal__inputs w-100">
        <Input
          name="name"
          class-name="rounded-end"
          label="Название компетенции"
          placeholder="Введите название компетенции"
          validate-on-update
        />

        <Select
          name="type"
          :options="skillTypeOptions"
          label="Тип компетенции*"
          placeholder="Выберите тип компетенции"
          validate-on-update
        ></Select>

        <Button
          v-if="skillModalMode === 'CREATE'"
          type="submit"
          class-name="btn-primary w-100"
          @click="handleCreateSkill"
        >
          Создать
        </Button>
        <Button
          v-if="skillModalMode === 'UPDATE'"
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

.modal-layout-enter-from .add-skill-modal,
.modal-layout-leave-to .add-skill-modal {
  transform: scale(0.9);
}
</style>
