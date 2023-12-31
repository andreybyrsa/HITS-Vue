<template>
  <PageLayout
    content-wrapper-class-name="bg-white"
    content-class-name="skills-view__content bg-white"
  >
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #header>
      <Header></Header>
    </template>

    <template #content>
      <SkillsTable
        v-if="skills"
        v-model="skills"
      />
      <TablePlaceholder v-else />

      <router-view />
    </template>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'
import SkillsTable from '@Components/Tables/SkillsTable/SkillsTable.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { Skill } from '@Domain/Skill'

import SkillsService from '@Services/SkillsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const skills = ref<Skill[]>()

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
</script>

<style lang="scss">
.skills-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
