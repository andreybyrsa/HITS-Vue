<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import Grid from '@Components/Ideas/Grid/Grid.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import FilterModal from '@Components/Modals/FilterModal/FilterModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import useIdeasStore from '@Store/ideas/ideasStore'
import useUserStore from '@Store/user/userStore'

const isOpenedFilter = ref(false)

const searchQuery = ref('')
const gridColumns = [
  'name',
  'status',
  'dateCreated',
  'dateModified',
  'rating',
  'risk',
]

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()
const { initiatorIdeas } = storeToRefs(ideasStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    // const { token } = currentUser
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiQURNSU4iLCJJTklUSUFUT1IiLCJFWFBFUlQiLCJQUk9KRUNUX09GRklDRSJdLCJzdWIiOiJwb2NodGE1NUBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkyMjg1OTYxLCJleHAiOjE2OTIzNzIzNjF9.w-J2jtixlNESXy5uO-xvtc7EybuuJQbbvWJmjHBZ3C8'
    await ideasStore.fetchIdeas(token)
  }
})

const selectedFilters = ref<string[]>([])

function handleCloseModal(filters?: string[]) {
  if (filters) {
    selectedFilters.value = filters
  }
  isOpenedFilter.value = false
}
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-100">Идеи</Typography>

      <div class="index-page__search bg-primary rounded-3 p-3 w-100">
        <Input
          name="asd"
          v-model="searchQuery"
          placeholder="Поиск идей по названию"
        >
          <template #prepend>
            <i class="bi bi-search"></i>
          </template>
        </Input>

        <Button
          class-name="btn-light"
          @click="isOpenedFilter = true"
          ><i class="bi bi-funnel-fill"></i>Фильтр</Button
        >
        <FilterModal
          :is-opened="isOpenedFilter"
          @close-modal="handleCloseModal"
          :current-filters="[...selectedFilters]"
        />
      </div>

      <Grid
        :data="initiatorIdeas"
        :columns="gridColumns"
        :filter-key="searchQuery"
        :selectedFilters="selectedFilters"
        class="demogrid w-100"
      />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.dev-page {
  &__content {
    @include flexible(center, start, column, $gap: 16px);
  }
}

.index-page__search {
  @include flexible(stretch, space-between, $gap: 16px);
}
</style>
