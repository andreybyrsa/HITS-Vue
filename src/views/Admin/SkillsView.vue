<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Skill } from '@Domain'
import { SkillsService } from '@Service'
import { useNotificationsStore } from '@Store'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Header from '@Components/Header/Header.vue'
import SkillsTable from '@Components/Tables/SkillsTable/SkillsTable.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const notificationsStore = useNotificationsStore()

const skills = ref<Skill[]>()

onMounted(async () => {
  const responseSkill = await SkillsService.getAllSkills()

  if (responseSkill instanceof Error) {
    return notificationsStore.createSystemNotification(
      'Система',
      responseSkill.message,
    )
  }

  skills.value = responseSkill
})
</script>

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

<style lang="scss">
.skills-view {
  &__content {
    overflow-y: scroll;
  }
}
</style>
