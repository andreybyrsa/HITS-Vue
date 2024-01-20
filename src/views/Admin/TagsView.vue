<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="tags-view__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header />
    </template>

    <template #content>
      <TagsTable
        v-if="tags"
        v-model="tags"
      />

      <TablePlaceholder v-else />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Header from '@Components/Header/Header.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import TagsService from '@Services/TagsService'
import { Tag } from '@Domain/Tag'
import TagsTable from '@Components/Tables/TagsTable/TagsTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const tags = ref<Tag[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseTag = await TagsService.getAllTags(token)

    if (responseTag instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseTag.message,
      )
    }

    tags.value = responseTag
  }
})
</script>

<style lang="scss" scoped>
.tags-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
