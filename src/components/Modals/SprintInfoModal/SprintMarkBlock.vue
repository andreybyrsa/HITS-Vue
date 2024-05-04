<script lang="ts" setup>
import { SprintMarks } from '@Domain/Project'

defineProps<{ sprintMarks: SprintMarks[] }>()
</script>

<template>
  <div>
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-5 border border-bottom-0"
    >
      Оценки
    </div>

    <div
      v-for="(member, index) in sprintMarks"
      :key="index"
      class="d-flex flex-column gap-2 bg-white rounded-bottom p-2 border border-top-0"
    >
      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-1">
          {{ member.firstName }} {{ member.lastName }}
        </div>
        <div>
          <div class="d-flex gap-1">
            Оценка:
            <div class="text-primary">{{ member.mark }}</div>
          </div>
          <div class="d-flex gap-1">
            Кол-во задач:
            <div class="text-primary">{{ member.countCompletedTasks ?? 0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
