<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { useForm } from 'vee-validate'
import { Skill, SkillType } from '@Domain'
import { useNotificationsStore } from '@Store'
import { SkillsService } from '@Service'
import { getSkillsInfo, validation } from '@Utils'
import {
  SkillModalProps,
  SkillModalEmits,
} from '@Components/Modals/SkillModal/SkillModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'

const skills = defineModel<Skill[]>({ required: true })
const props = defineProps<SkillModalProps>()
const emit = defineEmits<SkillModalEmits>()

const notificationsStore = useNotificationsStore()

const skillModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

const availableSkills = getSkillsInfo()

const isCreating = ref(false)
const isUpdating = ref(false)

const skillTypeOptions = availableSkills.skills.map((skillType) => ({
  value: skillType,
  label: availableSkills.translatedSkills[skillType],
}))

const { handleSubmit, setValues } = useForm<Skill>({
  validationSchema: {
    name: (value: string) =>
      validation.checkIsEmptyValue(value) || 'Неверно введено название компетенции',
    type: (value: SkillType) =>
      validation.checkIsEmptyValue(value) || 'Неверно выбран тип компетенции',
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
  isCreating.value = true
  const response = await SkillsService.createSkill(values)
  isCreating.value = false

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  skills.value.push(response)
  emit('close-modal')
})

const handleUpdateSkill = handleSubmit(async (values) => {
  isUpdating.value = true
  const response = await SkillsService.updateSkill(values, values.id)
  isUpdating.value = false

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  const skillIndex = skills.value.findIndex((skill) => skill.id === values.id)
  if (skillIndex !== -1) {
    skills.value.splice(skillIndex, 1, values)
  }

  emit('close-modal')
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
          variant="close"
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
          variant="primary"
          :is-loading="isCreating"
          @click="handleCreateSkill"
        >
          Создать
        </Button>
        <Button
          v-if="skillModalMode === 'UPDATE'"
          type="submit"
          variant="primary"
          :is-loading="isUpdating"
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
    @include flexible(stretch, flex-start, column, $gap: 12px);
  }
}

.modal-layout-enter-from .add-skill-modal,
.modal-layout-leave-to .add-skill-modal {
  transform: scale(0.9);
}
</style>
@Utils/validation
