<script lang="ts" setup>
import { ref } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ComboBox from '@Components/Inputs/Combobox/Combobox.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Icon from '@Components/Icon/Icon.vue'

import defineAxios from '@Utils/defineAxios'
import { tagsMocks } from '@Utils/getMocks'
import useTagsStore from '@Store/tags/tagsStore'
import { storeToRefs } from 'pinia'
import { Tag } from '@Domain/Tag'

import {
  CreateNewTaskProps,
  CreateTaskModalEmits,
} from '@Components/Modals/TaskModal/TaskModal.types'

defineProps<CreateNewTaskProps>()

const emit = defineEmits<CreateTaskModalEmits>()

const tagsAxios = defineAxios(tagsMocks)

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)
const choosenTags = ref<Tag[]>([])
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      class="task-modal border rounded-4 bg-white ps-4 pe-4 d-flex flex-column gap-2"
    >
      <div class="task-modal__header pt-2 w-100">
        <Header class="fs-4 text-primary w-100">Создание задачи</Header>
        <Button
          @click="emit('close-modal')"
          class-name="fs-5"
          variant="close"
        />
      </div>
      <div class="">
        <Typography class-name="text-primary">Название задачи*</Typography>
      </div>
      <div class="w-100">
        <Input
          class="form-control rounded"
          type="text"
          placeholder="Название"
        />
      </div>
      <div class="">
        <Typography class-name="text-primary">Описание задачи*</Typography>
      </div>
      <div class="w-100">
        <textarea
          class="form-control rounded"
          placeholder="Описание"
        ></textarea>
      </div>
      <div class="w-100">
        <ComboBox
          name="Теги"
          :options="tags"
          :display-by="['name']"
          v-model="choosenTags"
          placeholder="Выберите теги"
        ></ComboBox>
      </div>
      <div class="d-flex gap-2">
        <div
          class="d-flex gap-1 py-1"
          v-for="tag in choosenTags"
          :key="tag"
        >
          <Icon
            class-name="bi bi-circle-fill"
            :style="{ color: tag.color }"
          />
          <div>{{ tag.name }}</div>
        </div>
      </div>
      <div class="d-flex gap-2 w-100">
        <Typography class-name="text-primary pt-1">Трудоёмкость*</Typography>
        <Input
          class="form-control rounded"
          type="text"
          placeholder="Часы"
        />
      </div>
      <div class="py-3 w-100">
        <Button
          variant="primary"
          class-name="w-100"
          @click="emit('close-modal')"
          >Создать задачу</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.task-modal {
  width: 450px;
  height: fit-content;
  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center
  );
  &__header {
    @include flexible(center, space-between);
  }
}
</style>
