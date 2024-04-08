<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { SprintListProps } from '@Views/Project/Project.types'

import SprintsTable from '@Components/Tables/SprintsTable/SprintsTable.vue'

import useSprintsStore from '@Store/sprints/sprintsStore'
import useUserStore from '@Store/user/userStore'

defineProps<SprintListProps>()

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const projectId = route.params.id.toString()

    await sprintsStore.getAllSprints(projectId, token)
  }
})
</script>

<template>
  <div class="overflow-y-scroll">
    <SprintsTable
      :sprints="sprints"
      :project="project"
    />
  </div>
</template>
