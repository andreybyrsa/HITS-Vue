<template>
  <div class="d-flex gap-3">
    <div class="w-100">
      <ul class="list-group rounded-3">
        <li
          v-for="task in tasks"
          :key="task"
          class="list-group-item p-0 overflow-hidden"
        >
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="task.id"
          >
            {{ task.name }}
          </Button>
          <Collapse :id="task.id">
            <div class="p-2">{{ task.description }}</div>
          </Collapse>
        </li>
      </ul>
    </div>

    <div>111111111111111111111111</div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import useTasksStore from '@Store/tasks/tasksStore'

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
</script>

<style scoped lang="scss"></style>
