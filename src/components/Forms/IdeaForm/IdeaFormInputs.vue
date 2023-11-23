<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import { textareas, hints } from '@Components/Forms/IdeaForm/IdeaFormInputs.types'
import Typography from '@Components/Typography/Typography.vue'

function checkKeyDownValue(event: KeyboardEvent) {
  const isNotValidKeys = ['e', 'E', ',', '.', '-', '+']
  if (isNotValidKeys.includes(event.key)) {
    event.preventDefault()
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
      :hint="hints.name"
    />

    <Textarea
      v-for="(textarea, index) in textareas"
      :key="index"
      :name="textarea.name"
      validate-on-update
      :label="textarea.label"
      class-name="rounded-end"
      :placeholder="textarea.placeholder"
      :hint="textarea.hint"
    ></Textarea>

    <div>
      <Typography
        class-name="text-primary"
        :hint="hints.wandtedTeamSize"
      >
        Желаемое количество участников в команде*
      </Typography>

      <div class="mt-2 d-flex gap-3">
        <Input
          type="number"
          name="minTeamSize"
          class-name="rounded-end"
          :min="3"
          :max="7"
          validate-on-update
          placeholder="Минимальное количество: 3"
          @keydown="(event) => checkKeyDownValue(event)"
        />
        <Input
          type="number"
          name="maxTeamSize"
          class-name="rounded-end"
          :min="3"
          :max="7"
          validate-on-update
          placeholder="Максимальное количество: 7"
          @keydown="(event) => checkKeyDownValue(event)"
        />
      </div>
    </div>
  </div>
</template>
