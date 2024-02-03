<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { ref } from 'vue'

import FinishProjectModal from '@Components/Modals/FinishProjectModal/FinishProjectModal.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { ProjectProps } from '@Views/Project/Project.types'
import ProjectInfoTabs from '@Views/Project/ProjectInfoTabs'

const props = defineProps<ProjectProps>()
function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else return 'Реализуется'
}

const isOpenedFinishProjectModal = ref(false)
const isOpenedProjectInfoModal = ref(false)

function closeFinishProjectModal() {
  isOpenedFinishProjectModal.value = false
}
function openFinishProjectModal() {
  isOpenedFinishProjectModal.value = true
}

function closeProjectInfoModal() {
  isOpenedProjectInfoModal.value = false
}
function openProjectInfoModal() {
  isOpenedProjectInfoModal.value = true
}

function getContentTab(header: string) {
  if (header === 'Инициатор')
    return `${props.project.initiator.firstName} ${props.project.initiator.lastName}`
  if (header === 'Заказчик') return `${props.project.customer}`
  if (header === 'Дата старта') return getFormattedDate(props.project.startDate)
  if (header === 'Дата окончания') return getFormattedDate(props.project.finishDate)
}
</script>

<template>
  <div>
    <div
      class="content__info bg-primary rounded-top text-white fs-4 border border-bottom-0"
    >
      Информация
    </div>

    <div class="content__main bg-white rounded-bottom p-3 border border-top-0">
      <div
        v-for="(tab, index) in ProjectInfoTabs"
        :key="index"
        class="text-primary p-2"
      >
        <div class="text-secondary border-bottom pb-1 mb-2">{{ tab.header }}</div>
        <div class="content__main-person gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            :class="tab.icon"
          ></Icon>
          <Typography class-name="text-primary">{{
            getContentTab(tab.header)
          }}</Typography>
        </div>
      </div>
      <div class="mt-3">
        <Button
          variant="primary"
          class-name="w-100"
          >Перейти в идею</Button
        >
        <Button
          v-if="props.project.status === 'ACTIVE'"
          @click="openFinishProjectModal"
          variant="danger"
          class-name="w-100 mt-2"
          >Завершить проект</Button
        >
        <Button
          v-if="props.project.status === 'DONE'"
          @click="openProjectInfoModal"
          variant="primary"
          class-name="w-100 mt-2"
          >Информация о проекте</Button
        >
      </div>
    </div>
    <FinishProjectModal
      isFinishProject
      :is-opened="isOpenedFinishProjectModal"
      status="PROJECT"
      @close-modal="closeFinishProjectModal"
    />
    <FinishProjectModal
      isFinishProject
      :is-opened="isOpenedProjectInfoModal"
      status="PROJECTINFO"
      @close-modal="closeProjectInfoModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.content {
  &__info {
    width: 325px;
    height: 60px;
    @include flexible(center, center);
  }
  &__main {
    width: 325px;
    &-person {
      @include flexible(center, start);
    }
  }
}
.button {
  &__idea {
    height: 34px;
    @include flexible(center, center);
  }
  &__end {
    height: 34px;
    @include flexible(center, center);
  }
}
</style>
