<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import {
  projectTypeOptions,
  textareas,
} from '@Components/Forms/IdeaForm/IdeaFormInputs'
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <Input
      name="name"
      label="Название идеи*"
      class-name="rounded-end"
      placeholder="Введите название идеи"
    />

    <Select
      name="projectType"
      :options="projectTypeOptions"
      label="Тип проекта*"
      placeholder="Выберите тип проекта"
    ></Select>

    <Textarea
      v-for="(textarea, index) in textareas"
      :key="index"
      :name="textarea.name"
      :label="textarea.label"
      class-name="rounded-end"
      :placeholder="textarea.placeholder"
    ></Textarea>
  </div>
</template>
