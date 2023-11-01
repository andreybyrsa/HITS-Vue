<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import {
  IdeaFormInputsEmits,
  textareas,
} from '@Components/Forms/IdeaForm/IdeaFormInputs.types'
import Typography from '@Components/Typography/Typography.vue'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'
import { Idea } from '@Domain/Idea'

const emit = defineEmits<IdeaFormInputsEmits>()

function checkTeamsize(event: HTMLTargetEvent, name: keyof Idea) {
  const currentValue = event.target.value

  if (+currentValue > 7 || +currentValue < 3) {
    return emit('set-value', name, 3)
  }
}

function checkKeyDownValue(event: KeyboardEvent, name: keyof Idea) {
  const isNotValidKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'e',
    ',',
    '.',
    '-',
  ]
  if (isNotValidKeys.includes(event.key)) {
    return emit('set-value', name, '')
  }
}
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <Input
      name="name"
      validate-on-update
      label="Название идеи*"
      class-name="rounded-end"
      placeholder="Введите название идеи"
    />

    <Textarea
      v-for="(textarea, index) in textareas"
      :key="index"
      :name="textarea.name"
      validate-on-update
      :label="textarea.label"
      class-name="rounded-end"
      :placeholder="textarea.placeholder"
    ></Textarea>

    <div>
      <Typography class-name="text-primary">
        Желаемое количество участников в команде*
      </Typography>

      <div class="mt-2 d-flex gap-3">
        <Input
          name="minTeamSize"
          validate-on-update
          class-name="rounded-end"
          type="number"
          placeholder="Минимальное количество"
          @input="(event) => checkTeamsize(event, 'minTeamSize')"
          @keydown="(event) => checkKeyDownValue(event, 'minTeamSize')"
        />
        <Input
          name="maxTeamSize"
          validate-on-update
          class-name="rounded-end"
          type="number"
          placeholder="Максимальное количество"
          @input="(event) => checkTeamsize(event, 'maxTeamSize')"
          @keydown="(event) => checkKeyDownValue(event, 'maxTeamSize')"
        />
      </div>
    </div>
  </div>
</template>
