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

const selectedFilters = ref<string[]>([])
const searchQuery = ref('')
const gridColumns = ['name', 'status', 'dateCreated', 'dateModified', 'rating']

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()
const { ideas } = storeToRefs(ideasStore)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    // const { token } = currentUser
    const token = user.value?.token
    await ideasStore.fetchIdeas(token as string)
  }
})

function handleCloseModal(filters?: string[]) {
  if (filters) {
    selectedFilters.value = filters
  }
  isOpenedFilter.value = false
}
</script>

<template>
  <PageLayout content-class-name="ideas-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-100">Список идей</Typography>

      <div class="ideas-page__search bg-primary rounded-3 p-2 w-100">
        <Input
          name="search-input"
          class-name="rounded-end"
          v-model="searchQuery"
          placeholder="Поиск идей по названию"
        >
          <template #prepend>
            <i class="bi bi-search"></i>
          </template>
        </Input>

        <Button
          class-name="btn-light"
          prepend-icon-name="bi bi-funnel"
          @click="isOpenedFilter = true"
        >
          Фильтр
        </Button>
        <FilterModal
          :is-opened="isOpenedFilter"
          @close-modal="handleCloseModal"
          :current-filters="[...selectedFilters]"
        />
      </div>

      <Grid
        :data="ideas"
        :columns="gridColumns"
        :filter-key="searchQuery"
        :selectedFilters="selectedFilters"
        class="demogrid w-100"
      />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.ideas-page {
  &__content {
    @include flexible(center, start, column, $gap: 12px);
  }

  &__search {
    @include flexible(stretch, space-between, $gap: 8px);
  }
}
</style>
