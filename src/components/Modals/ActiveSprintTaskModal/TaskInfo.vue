<script lang="ts" setup>
import { TaskDataProps } from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'
import TaskInfoTabs from '@Components/Modals/ActiveSprintTaskModal/TaskInfoTabs.types'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

import { getTaskStatus } from '@Utils/getTaskStatus'

const props = defineProps<TaskDataProps>()

const getContentTab: {
  [key: string]: string
} = {
  initiator: `${props.task.initiator.firstName} ${props.task.initiator.lastName}`,
  executor: props.task.executor?.id
    ? `${props.task.executor.firstName} ${props.task.executor.lastName}`
    : 'Не назначен',
  workHour: `${props.task.workHour}ч`,
}
</script>

<template>
  <div>
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-4 border border-bottom-0"
    >
      {{ getTaskStatus().translatedStatus[props.task.status] }}
    </div>

    <div
      class="d-flex flex-column gap-2 bg-white rounded-bottom p-3 border border-top-0"
    >
      <div
        v-for="(tab, index) in TaskInfoTabs"
        :key="index"
        class="px-2"
      >
        <div class="text-secondary border-bottom pb-1 mb-2">{{ tab.header }}</div>
        <div class="content gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            :class="tab.icon"
          />
          <Typography class-name="text-primary">
            {{ getContentTab[tab.content] }}
          </Typography>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  @include flexible(center, start);
}
</style>
