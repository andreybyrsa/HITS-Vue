<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import SprintsTable from '@Components/Tables/SprintsTable/SprintsTable.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import useSprintsStore from '@Store/sprints/sprintsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const sprintssStore = useSprintsStore()
const { sprints } = storeToRefs(sprintssStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await useSprintsStore().getAllSprints(token)
  }
})
</script>

<template>
  <div
    class="w-100"
    class-name="sprints-page__content"
  >
    <SprintsTable :sprint="sprints" />
  </div>
</template>

<style lang="scss" scoped>
.sprints-page {
  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
