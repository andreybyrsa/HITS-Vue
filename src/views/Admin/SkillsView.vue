<template>
  <PageLayout content-class-name="p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <div class="skills-page__header">
        <Typography class-name="fs-2 text-primary">Список компетенций</Typography>

        <Button
          class-name="btn-primary"
          prepend-icon-name="bi bi-plus-lg"
          @click="openCreatingSkillModal"
        >
          Добавить компетеницю
        </Button>
      </div>

      <template v-if="skills">
        <SkillsTable v-model="skills" />
        <SkillModal
          :is-opened="isOpenCreatingSkillModal"
          v-model="skills"
          @close-modal="closeCreatingSkillModal"
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
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Button from '@Components/Button/Button.vue'
import SkillsTable from '@Components/Tables/SkillsTable/SkillsTable.vue'
import SkillModal from '@Components/Modals/SkillModal/SkillModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Skill } from '@Domain/Skill'

import SkillsService from '@Services/SkillsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const skills = ref<Skill[]>()

const isOpenCreatingSkillModal = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseSkill = await SkillsService.getAllSkills(token)

    if (responseSkill instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseSkill.message,
      )
    }

    skills.value = responseSkill
  }
})

function openCreatingSkillModal() {
  isOpenCreatingSkillModal.value = true
}
function closeCreatingSkillModal() {
  isOpenCreatingSkillModal.value = false
}
</script>

<style lang="scss">
.skills-page {
  &__header {
    @include flexible(center, space-between);
  }
}
</style>
