<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import IdeasTable from '@Components/Tables/IdeasTable/IdeasTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideaStore = useIdeasStore()
const { ideas } = storeToRefs(ideaStore)

const router = useRouter()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await ideaStore.fetchIdeas(token)
  }
})

function navigateToCreateIdeaPage() {
  router.push('/ideas/create')
}
</script>

<template>
  <PageLayout content-class-name="ideas-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="ideas-page__header w-100">
        <Typography class-name="fs-2 text-primary">Список идей</Typography>
        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-plus-lg"
          @click="navigateToCreateIdeaPage"
        >
          Создать идею
        </Button>
      </div>

      <IdeasTable
        v-if="ideas"
        :ideas="ideas"
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.ideas-page {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    @include flexible(stretch, flex-start, column);
  }
}
</style>
