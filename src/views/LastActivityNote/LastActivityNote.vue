<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Change } from '@Views/LastActivityNote/LastActivityNote.types'
import LastActivityNoteTable from '@Views/LastActivityNote/LastActivityNoteTable.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

const changes = ref<Change[]>([])

onMounted(() => {
  const data: Change[] = [
    {
      number: 1,
      date: new Date('2021-02-01'),
      who: 'Victor',
      doing: 'Одобрил идею',
      name: '673',
    },
    {
      number: 2,
      date: new Date('2021-02-05'),
      who: 'Andre',
      doing: 'Внес изменения',
      name: '76',
    },
    {
      number: 3,
      date: new Date('2021-01-11'),
      who: 'Jo',
      doing: 'Внес изменения',
      name: '142',
    },
    {
      number: 4,
      date: new Date('2021-08-22'),
      who: 'Ivan',
      doing: 'Удалил идею',
      name: '1272',
    },
  ]
  changes.value = data
})
</script>

<template>
  <PageLayout content-class-name="last-activity-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-1 text-primary">Журнал изменений</Typography>
      <LastActivityNoteTable :changes="changes"></LastActivityNoteTable>
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.last-activity-page {
  &__content {
    overflow-y: scroll;

    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }
}
</style>
