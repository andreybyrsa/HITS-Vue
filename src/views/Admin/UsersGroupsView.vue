<template>
  <PageLayout content-class-name="p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="users-groups-page__header">
        <Typography class-name="fs-2 text-primary">Группы пользователей</Typography>

        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-plus-lg"
          @click="openCreatingGroupModal"
        >
          Создать группу
        </Button>
      </div>

      <template v-if="usersGroups">
        <UsersGroupsTable v-model="usersGroups" />

        <UsersGroupModal
          :isOpened="isOpenedCreatingGroupModal"
          v-model="usersGroups"
          @close-modal="closeCreatingGroupModal"
        />
      </template>

      <TablePlaceholder v-else />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import UsersGroupsTable from '@Components/Tables/UsersGroupsTable/UsersGroupsTable.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import UsersGroupModal from '@Components/Modals/UsersGroupModal/UsersGroupModal.vue'
import Button from '@Components/Button/Button.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import UsersGroup from '@Domain/UsersGroup'

import UsersGroupsService from '@Services/UsersGroupsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const usersGroups = ref<UsersGroup[]>()

const isOpenedCreatingGroupModal = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseGroups = await UsersGroupsService.getUsersGroups(token)

    if (responseGroups instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseGroups.message,
      )
    }

    usersGroups.value = responseGroups
  }
})

function openCreatingGroupModal() {
  isOpenedCreatingGroupModal.value = true
}
function closeCreatingGroupModal() {
  isOpenedCreatingGroupModal.value = false
}
</script>

<style lang="scss">
.users-groups-page {
  &__header {
    @include flexible(center, space-between);
  }
}
</style>
