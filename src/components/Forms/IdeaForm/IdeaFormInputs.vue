<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import {
  projectTypeOptions,
  textareas,
} from '@Components/Forms/IdeaForm/IdeaFormInputs'

const modelValue = defineModel({
  required: true,
})
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <Input
      name="name"
      label="Название идеи*"
      class-name="fs-6"
      placeholder="Введите название идеи"
    />

    <Select
      label="Тип проекта*"
      :options="projectTypeOptions"
      v-model="modelValue"
    ></Select>

    <Textarea
      v-for="(textarea, index) in textareas"
      :key="index"
      :name="textarea.name"
      :label="textarea.label"
      :class-name="textarea.className"
      :placeholder="textarea.placeholder"
    ></Textarea>
  </div>
</template>
