<script lang="ts" setup>
import DemoGrid from './Grid.vue'
import { ref } from 'vue'
import Input from '@Components/Inputs/Input/Input.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import loginInputs from '@Components/Forms/LoginForm/LoginFormInputs'

const searchQuery = ref('')
const gridColumns = [
  'name',
  'status',
  'creationDate',
  'updatedDate',
  'rating',
  'risk',
]
const gridData = [
  {
    name: 'Беспроводные зарядки на партах',
    status: 'На согласовании',
    creationDate: new Date('2022-01-10'),
    updatedDate: new Date('2022-01-15'),
    rating: 4.5,
    risk: 2.7,
  },
  {
    name: 'Кондиционеры в кабинетах',
    status: 'На согласовании',
    creationDate: new Date('2021-01-10'),
    updatedDate: new Date('2021-01-15'),
    rating: 3.4,
    risk: 3.9,
  },
  {
    name: 'Свежая булочная на 5ом этаже ВШЦТ',
    status: 'На согласовании',
    creationDate: new Date('2019-10-20'),
    updatedDate: new Date('2020-01-15'),
    rating: 4.9,
    risk: 3.9,
  },
  {
    name: 'Макбуки',
    status: 'На согласовании',
    creationDate: new Date('2023-01-10'),
    updatedDate: new Date('2019-01-15'),
    rating: 5,
    risk: 4,
  },
]
</script>

<template>
  <PageLayout content-class-name="dev-page__content p-3">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <div class="grid-container"></div>
    <template #content>
      <Typography class-name="fs-2 text-primary w-100">Идеи</Typography>

      <div
        id="search"
        style="width: 100%"
        class="row bg-primary rounded-3 p-3"
      >
        <Input
          v-model="searchQuery"
          placeholder="Поиск идей по названию"
          class-name="col"
          style="width: 85%"
        >
          <template #prepend>
            <i class="bi bi-search"></i>
          </template>
        </Input>

        <Button
          class-name="btn-light col"
          style="width: 15%"
          ><i class="bi bi-funnel-fill"></i>Фильтр</Button
        >
      </div>
      <DemoGrid
        :data="gridData"
        :columns="gridColumns"
        :filter-key="searchQuery"
        class="demogrid"
        style="min-width: 100%"
      >
      </DemoGrid>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.dev-page {
  &__content {
    @include flexible(center, start, column, $gap: 16px);
  }
}
</style>
