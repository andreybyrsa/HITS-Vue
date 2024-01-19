<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { ref } from 'vue'

import FinishProjectModal from '@Components/Modals/FinishProjectModal/FinishProjectModal.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { ProjectProps } from '@Views/Project/Project.types'

defineProps<ProjectProps>()
function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else return 'Реализуется'
}

const isOpenedFinishProjectModal = ref(false)

function closeFinishProjectModal() {
  isOpenedFinishProjectModal.value = false
}

function openFinishProjectModal() {
  isOpenedFinishProjectModal.value = true
}
</script>

<template>
  <div>
    <div
      class="content__info bg-primary rounded-top text-white fs-3 border border-bottom-0"
    >
      Информация
    </div>

    <div class="content__main bg-white rounded-bottom p-3 border border-top-0">
      <div class="text-secondary border-bottom pb-1 mb-2">Инициатор</div>
      <div class="content__main-person gap-1">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25"></Icon>
        <Typography class-name="text-primary"
          >{{ project.initiator.firstName }}
          {{ project.initiator.lastName }}</Typography
        >
      </div>
      <div class="text-secondary border-bottom pb-1 mb-2 mt-2">Заказчик</div>
      <div class="content__main-person gap-1">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25"></Icon>
        <Typography class-name="text-primary">{{ project.customer }}</Typography>
      </div>
      <div class="text-secondary border-bottom pb-1 mb-2 mt-2">Дата старта</div>
      <div class="content__main-person gap-1">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25"></Icon>
        <Typography class-name="text-primary">{{
          getFormattedDate(project.startDate)
        }}</Typography>
      </div>
      <div class="text-secondary border-bottom pb-1 mb-2 mt-2">Дата окончания</div>
      <div class="content__main-person gap-1">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25"></Icon>
        <Typography class-name="text-primary">{{
          getFormattedDate(project.finishDate)
        }}</Typography>
      </div>
      <div class="mt-3">
        <Button
          variant="primary"
          class-name="w-100"
          >Перейти в идею</Button
        >
        <Button
          @click="openFinishProjectModal"
          variant="danger"
          class-name="w-100 mt-2"
          >Завершить проект</Button
        >
      </div>
    </div>
    <FinishProjectModal
      :is-opened="isOpenedFinishProjectModal"
      @close-modal="closeFinishProjectModal"
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
    height: 411px;
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
