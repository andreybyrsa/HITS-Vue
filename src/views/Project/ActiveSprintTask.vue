<template>
  <div>
    <div
      class="d-flex my-1 cursor-pointer"
      @click="openTaskModal(task)"
    >
      <div
        :style="{ width: '6px', backgroundColor: getColorBand(task) }"
        class="rounded-start"
      />
      <div
        class="bg-white p-2 border-top border-end border-bottom w-100 rounded-end"
      >
        <div class="d-flex flex-column border-bottom pb-2">
          <div class="active-sprint__task">
            <div class="text-ellipsis">{{ task.name }}</div>
          </div>
          <div class="d-flex gap-1 text-secondary">
            {{ task.executor?.firstName }} {{ task.executor?.lastName }}
          </div>
          <div
            class="d-flex gap-1 text-secondary text-info"
            v-if="task.status === 'OnModification' && task.leaderComment"
          >
            <Typography>
              <div class="comment">{{ task.leaderComment }}</div>
            </Typography>
          </div>
          <div
            class="d-flex gap-1 text-secondary text-info"
            v-if="task.status === 'OnVerification' && task.executorComment"
          >
            <Typography
              ><div class="comment">{{ task.executorComment }}</div></Typography
            >
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 w-100 mt-2">
          <div
            v-for="(tag, index) in task.tags"
            :key="index"
            :style="{
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
              color: tag.color,
            }"
            class="px-2 py-1 rounded-2 text-center align-self-start"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Task } from '@Domain/Project'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

import { useRouter } from 'vue-router'
import { ActiveSprintTaskProps } from '@Views/Project/Project.types'
import Typography from '@Components/Typography/Typography.vue'

defineProps<ActiveSprintTaskProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

function getColorBand(task: Task) {
  return task.executor?.id === user.value?.id ? '#0D6EFD' : '#9E9E9E'
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}

function openTaskModal(task: Task) {
  router.push(`/projects/${task.projectId}/${task.id}`)
}
</script>

<style lang="scss" scoped>
.comment {
  @include textEllipsis(2);
}
</style>
